'use strict';
const User = require('../../../../models/User');
const geoUtils = require('../../../../lib/geoutils');


module.exports = function (req, res, next) {
    let userId = req.params.id;
    let dogId = req.params.dogId;

    User.findOne({ '_id': userId, 'dogs._id': dogId },
        { 'dogs.$': 1, 'coordinates': 1 },
        (err, user) => {
            if (err) {
                next(err);
                return;
            }
            let query = user.dogs[0].query;
           
            if (query && (query.age || query.breed || query.max_kms) ) {
                if (user.coordinates && user.coordinates.length > 0 && query.max_kms) {
                    let maxDistance = geoUtils.getRadsFromDistance(query.max_kms);
                    User.where('coordinates').near({ center: user.coordinates, maxDistance: maxDistance, spherical: true, })
                        .where('_id').ne(user._id)
                        .exec((err, result) => {
                            if (err) {
                                next(err);
                            }
                            let dogs = result.map(user => user.dogs).reduce(function (a, b) {
                                return a.concat(b);
                            }, []).filter(dog => {
                                var isDogInSearch = true;
                                if (query.age && query.age >= 0) { 
                                    isDogInSearch = dog.age !== query.age;
                                }
                                if (query.breed && query.breed !== '') { 
                                    isDogInSearch = dog.breed !== query.breed;
                                }
                                return isDogInSearch;
                            });
                            res.json({ success: true, result: dogs });
                        });
                } else {
                    var searchFilter = {};
                    if (query.age && query.age >= 0 && query.breed && query.breed !== '') {
                        searchFilter = { $and: [{ 'dogs.age': query.age }, { 'dogs.breed': query.breed }] };
                    } else if (query.age && query.age >= 0) { 
                        searchFilter = { 'dogs.age': query.age };
                    } else if (query.breed && query.breed !== '') { 
                        searchFilter = { 'dogs.breed': query.breed };
                    }
                    User.aggregate()
                        .match(searchFilter)
                        .unwind('dogs')
                        .match(searchFilter)
                        .exec((err, result) => {
                            if (err) {
                                next(err);
                            }
                            
                            let dogs = result
                                .filter(userFiltered => userFiltered._id.toString() !== user._id.toString())
                                .map(user => user.dogs);
                           
                            res.json({ success: true, result: dogs });
                        });
                }
            } else { 
                res.json({ success: true, result: [] });
            }
        });
    
};