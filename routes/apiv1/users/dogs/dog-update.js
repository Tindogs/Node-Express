'use strict';
const User = require('../../../../models/User');
const dbUtils = require('../../../../lib/dbutils');

module.exports = function (req, res, next) {
    let userId = req.params.id;
    let dogId = req.params.dogId;

    var setFields = dbUtils.getDogUpdateFields(req.body, false);

    User.findOneAndUpdate(
        { '_id': userId, 'dogs._id': dogId },
        { $set: setFields },
        { upsert: false, new: true })
        .then(userUpdate => {
            res.json({ success: true, result: userUpdate });
    })
        .catch(err => {
            next(err);
            return;
        });
};