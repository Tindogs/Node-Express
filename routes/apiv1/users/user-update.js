'use strict';
const User = require('../../../models/User');
const dbUtils = require('../../../lib/dbutils');

module.exports = function (req, res, next) {
    let userId = req.params.id;
    let update = dbUtils.getDogUpdateFields(req.body);
  
    User.findByIdAndUpdate ({ '_id': userId},
        { $set: update },
        { upsert: false, new: true }, (err, userUpdate) => {
            if (err) {
                next(err);
                return;
            }

            res.json({ success: true, result: userUpdate });
        });
};