'use strict';
const User = require('../../../../models/User');

module.exports = function (req, res, next) {
    User.findById(req.params.id).
        then(user => {
        res.json({ success: true, result: user });
        })
        .catch(err => {
            next(err);
            return;
        });
};