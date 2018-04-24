'use strict';

const sha = require('sha256');

var getDogUpdateFields = function (dogObject) {
    var setFields = {};
    if (dogObject.name) {
        setFields['dogs.$.name'] = dogObject.name;
    }

    if (dogObject.age) {
        setFields['dogs.$.age'] = dogObject.age;
    }

    if (dogObject.breed) {
        setFields['dogs.$.breed'] = dogObject.breed;
    }

    if (dogObject.purebreed) {
        setFields['dogs.$.purebreed'] = dogObject.purebreed;
    }

    if (dogObject.color) {
        setFields['dogs.$.color'] = dogObject.color;
    }

    if (dogObject.description) {
        setFields['dogs.$.description'] = dogObject.description;
    }

    if (dogObject.photos) {
        setFields['dogs.$.photos'] = dogObject.photos;
    }
    if (dogObject.queryage) {

        setFields['dogs.$.query.age'] = dogObject.queryage;
    }
    if (dogObject.querymaxkms) {
        setFields['dogs.$.query.max_kms'] = dogObject.querymaxkms;
    }

    if (dogObject.queryreproductive) {
        setFields['dogs.$.query.reproductive'] = dogObject.queryreproductive;
    }

    if (dogObject.querybreed) {
        setFields['dogs.$.query.breed'] = dogObject.querybreed;
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
