'use strict';
const User = require('../../../models/User');

const sha = require('sha256');
const tokens = require('../../../lib/tokens');

const CustomError = require('../../../lib/CustomError');
const winston = require('winston');

module.exports = function (req, res, next) {

    const user = req.body;
    if (user) {                      //hay algo en el body...
        User.findOne({ email: req.body.email }).then(data => {
            try {
                if (data === null || data.password !== sha.x2(user.password)) {                      //no devuelve nada por ese email
                    return(next(new CustomError('Credentials not valid', 401)));
                    
                }
         
                winston.info('Usuario autenticado. Nombre: %s, Email: %s', data.first_name, data.email);
                res.json({ success: true, token: tokens.createToken(data), result: data });
            } catch (error) {
                next(error);
            }
           
        }).catch(err => { 
            return (next(new CustomError('Error while authenticating user', err)));
        });
    }
};
