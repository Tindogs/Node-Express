'use strict';

const User = require('../../../../models/User');
const dbUtils = require('../../../../lib/dbutils');

module.exports = function (req, res, next) {
    let userId = req.params.id;

    let dog = dbUtils.getDogUpdateFields(req.body);

    User.findByIdAndUpdate(userId, { $addToSet: { dogs: dog } }, { upsert: true, new: true })
        .then(dogSaved => {
            res.json({ success: true, result: dogSaved });
        })
        .catch(err => {
            next(err);
            return;
        });
};