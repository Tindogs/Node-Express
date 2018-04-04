'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');

function createToken (user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1440, 'minutes').unix()
    };

    return jwt.encode(payload, config.secret);
}

function decodeToken (token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.secret);

            if (payload.exp <= moment().unix()) {
                reject({
                  status: 401,
                  message: 'Token has expired'
              });
            }
            resolve(payload.sub);
        } catch (err) {
            reject({
                status: 500,
                message: 'Token not valid'
            });
        }
    });

    return decoded;
}

module.exports = {
    createToken,
    decodeToken
};