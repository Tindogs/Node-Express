'use strict';
const User = require('../../../models/User');

const sha = require('sha256');
const tokens = require('../../../lib/tokens');


module.exports = function (req, res, next) {
    const user = new User(req.body);
    user.password = sha.x2(user.password);
    user.save((err, userSave) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ success: true, token: tokens.createToken(user), result: userSave });
    });
};