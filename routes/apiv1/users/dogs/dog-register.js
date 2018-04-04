'use strict';

const User = require('../../../../models/User');


module.exports = function (req, res, next) {
    let userId = req.params.id;

    var dog = {
        'name': req.body.name,
        'age': req.body.age,
        'breed': req.body.breed,
        'purebreed': req.body.purebreed,
        'color': req.body.color,
        'description': req.body.description,
        'photos': req.body.photos
    };

    User.findByIdAndUpdate(userId, { $addToSet: { dogs: dog } }, { upsert: true, new: true }, (err, dogSave) => {
        if (err) {
            next(err);
            return;
        }

        res.json({ success: true, result: dogSave });
    });
};