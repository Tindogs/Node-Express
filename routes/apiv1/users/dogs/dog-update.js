'use strict';
const User = require('../../../../models/User');

module.exports = function (req, res, next) {
    let userId = req.params.id;
    let dogId = req.params.dogId;

    var setFields = {};
    if (req.body.name) {
        setFields['dogs.$.name'] = req.body.name;
    }
    
    if (req.body.age) { 
        setFields['dogs.$.age'] = req.body.age;
    }
      
    if (req.body.breed) {
        setFields['dogs.$.breed'] = req.body.breed;
    }
  
    if (req.body.purebreed) {
        setFields['dogs.$.purebreed'] = req.body.purebreed;
    }

    if (req.body.color) {
        setFields['dogs.$.color'] = req.body.color;
    }

    if (req.body.description) {
        setFields['dogs.$.description'] = req.body.description;
    }

    if (req.body.photos) {
        setFields['dogs.$.photos'] = req.body.photos;
    }
    if (req.body.queryage) {
      
        setFields['dogs.$.query.age'] = req.body.queryage;
    }
    if (req.body.querymaxkms) {
        setFields['dogs.$.query.max_kms'] = req.body.querymaxkms;
    }
    
    if (req.body.queryreproductive) {
        setFields['dogs.$.query.reproductive'] = req.body.queryreproductive;
    }

    if (req.body.querybreed) {
        setFields['dogs.$.query.breed'] = req.body.querybreed;
    }

    User.findOneAndUpdate(
        { '_id': userId, 'dogs._id': dogId },
        { $set: setFields },
        { upsert: false, new: true }, (err, userUpdate) => {
            if (err) {
                next(err);
                return;
            }

            res.json({ success: true, result: userUpdate });
        });
};