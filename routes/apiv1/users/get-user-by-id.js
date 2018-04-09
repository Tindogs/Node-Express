'use strict';
const User = require('../../../models/User');
module.exports = function (req, res, next) {
    
    User.findById(req.params.id, (err, users) => {
        if (err) {
            next(err);
            return;
        }

        res.json({ success: true, result: users });

    });

    
};