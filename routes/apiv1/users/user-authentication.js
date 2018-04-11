'use strict';
const User = require('../../../models/User');

const sha = require('sha256');
const tokens = require('../../../lib/tokens');

module.exports = function (req, res, next) {

    const user = req.body;
    if (user) {                      //hay algo en el body...
        User.findOne({ email: req.body.email }).exec((err, data) => {
            if (err) {
                return (next(err));
            }
            if (data === null) {                      //no devuelve nada por ese email
                return (res.sendStatus(401));
            }
            if (data.password !== sha.x2(user.password)) {    // tiene que coincidir usuario y pass
                return (res.sendStatus(401));
            }
          
            res.json({ success: true, token: tokens.createToken(data), result: data });
        });
    }
};