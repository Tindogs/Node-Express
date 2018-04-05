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