"use strict";

const jwt    = require('jwt-simple');
const moment = require('moment');
const config = require('./config');
const mongoose  = require('mongoose');
const User   = mongoose.model('User');
const sha       = require('sha256');

module.exports = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(403).send({success: false, result:'Unauthorized'});
    }
    const token   = req.headers.token;
    const payload = jwt.decode(token, config.secret);
    if(payload.exp <= moment().unix()){
        return res.status(401).send({success: false, result:'Token has expired'});
    } 

    req.user = payload.sub;
    next();
}