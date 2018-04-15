'use strict';
const User = require('../../../models/User');
const CustomError = require('../../../lib/CustomError');
const sha = require('sha256');
const tokens = require('../../../lib/tokens');


module.exports = function (req, res, next) {
    const user = new User(req.body);
    user.password = sha.x2(user.password);
    user.save.then(userSave => {
        
        res.json({ success: true, token: tokens.createToken(user), result: userSave });
    }).catch(err => { 
        return(next(new CustomError('Error while register user',err)));
    }
    );
};