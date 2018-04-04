'use strict';
const User = require('../../../../models/User');

module.exports = function (req, res, next) {
    let userId = req.params.id;
    let dogId = req.params.dogId;
    // esto no funciona bien, borra los campos que no vienen en el body
    var dog = {
        'name': req.body.name,
        'age': req.body.age,
        'breed': req.body.breed,
        'purebreed': req.body.purebreed,
        'color': req.body.color,
        'description': req.body.description,
        'photos': req.body.photos
    };

  
    User.findOneAndUpdate(
        { '_id': userId, 'dogs._id': dogId },
        { $set: { 'dogs.$': dog } },
        { upsert: true, new: true }, (err, userUpdate) => {
            if (err) {
                next(err);
                return;
            }

            res.json({ success: true, result: userUpdate });
        });
};