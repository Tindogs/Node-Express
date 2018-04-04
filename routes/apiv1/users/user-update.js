'use strict';
const User = require('../../../models/User');

module.exports = function (req, res, next) {
    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdate) => {
        if (err) {
            next(err);
            return;
        }

        res.json({ success: true, result: userUpdate });
    });
};