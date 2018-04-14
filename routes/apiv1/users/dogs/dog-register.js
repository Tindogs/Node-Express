'use strict';

const User = require('../../../../models/User');


module.exports = function (req, res, next) {
    let userId = req.params.id;

    var dog = {};
    if (req.body.name) {
        dog['name'] = req.body.name;
    }
    
    if (req.body.age) { 
        dog['age'] = req.body.age;
    }
      
    if (req.body.breed) {
        dog['breed'] = req.body.breed;
    }
  
    if (req.body.purebreed) {
        dog['purebreed'] = req.body.purebreed;
    }

    if (req.body.color) {
        dog['color'] = req.body.color;
    }

    if (req.body.description) {
        dog['description'] = req.body.description;
    }

    if (req.body.photos) {
        dog['photos'] = req.body.photos;
    }
    if (req.body.queryage) {
      
        dog['query.age'] = req.body.queryage;
    }
    if (req.body.querymaxkms) {
        dog['query.max_kms'] = req.body.querymaxkms;
    }
    
    if (req.body.queryreproductive) {
        dog['query.reproductive'] = req.body.queryreproductive;
    }

    if (req.body.querybreed) {
        dog['query.breed'] = req.body.querybreed;
    }

    console.log(dog);

    User.findByIdAndUpdate(userId, { $addToSet: { dogs: dog } }, { upsert: true, new: true }, (err, dogSave) => {
        if (err) {
            next(err);
            return;
        }

        res.json({ success: true, result: dogSave });
    });
};