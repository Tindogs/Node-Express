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
           
            if (query) {
                if (user.coordinates && user.coordinates.length > 0) {
                    let maxDistance = geoUtils.getRadsFromDistance(query.max_kms);
                    User.where('coordinates').near({ center: user.coordinates, maxDistance: maxDistance, spherical: true, })
                        .where('_id').ne(user._id)
                        .exec((err, result) => {
                            if (err) {
                                next(err);
                            }
                            let dogs = result.map(user => user.dogs).reduce(function (a, b) {
                                return a.concat(b);
                            }, []).filter(dog => (dog.age === query.age) && (dog.breed === query.breed));
                            res.json({ success: true, result: dogs });
                        });
                } else {
                    User.aggregate()
                        .match({ $and: [{ 'dogs.age': query.age }, { 'dogs.breed': query.breed }] })
                        .unwind('dogs')
                        .match({ $and: [{ 'dogs.age': query.age }, { 'dogs.breed': query.breed }] })
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