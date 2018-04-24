'use strict';

const sha = require('sha256');

var getDogUpdateFields = function (dogObject, register = true) {
    var setFields = {};
    var prefix = '';
    if (!register) { 
        prefix = 'dogs.$.';
    }
    if (dogObject.name) {
        setFields[prefix + 'name'] = dogObject.name;
    }

    if (dogObject.age) {
        setFields[prefix + 'age'] = dogObject.age;
    }

    if (dogObject.breed) {
        setFields[prefix + 'breed'] = dogObject.breed;
    }

    if (dogObject.purebreed !== undefined) {
        setFields[prefix + 'purebreed'] = dogObject.purebreed;
    }

    if (dogObject.color) {
        setFields[prefix + 'color'] = dogObject.color;
    }

    if (dogObject.description) {
        setFields[prefix + 'description'] = dogObject.description;
    }

    if (dogObject.photos) {
        setFields[prefix + 'photos'] = dogObject.photos;
    }
    if (dogObject.queryage) {

        setFields[prefix + 'query.age'] = dogObject.queryage;
    }
    if (dogObject.querymaxkms) {
        setFields[prefix + 'query.max_kms'] = dogObject.querymaxkms;
    }

    if (dogObject.queryreproductive !== undefined) {
        setFields[prefix + 'query.reproductive'] = dogObject.queryreproductive;
    }

    if (dogObject.querybreed) {
        setFields[prefix + 'query.breed'] = dogObject.querybreed;
    }

    return setFields;
};

var getUpdateUserFields = function (userObject) {
    var setFields = {};
    if (userObject.first_name) {
        setFields['first_name'] = userObject.first_name;
    }

    if (userObject.last_name) {
        setFields['last_name'] = userObject.last_name;
    }

    if (userObject.email) {
        setFields['email'] = userObject.email;
    }

    if (userObject.userame) {
        setFields['username'] = userObject.userame;
    }

    if (userObject.coordinates) {
        setFields['coordinates'] = userObject.coordinates;
    }

    if (userObject.password) {
        setFields['password'] = sha.x2(userObject.password);
    }
   
    return setFields;
};

module.exports = {
    getDogUpdateFields: getDogUpdateFields,
    getUpdateUserFields: getUpdateUserFields
};
