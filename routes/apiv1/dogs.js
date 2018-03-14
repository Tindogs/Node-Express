'use strict';

var express = require('express');
var router = express.Router();
const User = require('../../models/User')

const auth = require('../../lib/auth');


/* Find Dogs By UserId */
// GET HTTP METHOD
// Needs a valid token key value at header request
// EXAMPLE: http://localhost:3000/apiv1/dogs/fromuser?id=5aa720e07dc74c4677a5c313

router.get('/fromuser', auth,  (req, res, next) => {
  
    User.findById(req.query.id, (err, users) => {
        if (err) {
            next(err);
            return
        }

        res.json({ success: true, result: users.dogs });

    });
});



/* New Dog or Update Dog By UserId */
// PUT HTTP METHOD
// Needs a valid token key value at header request
// Send object at body with raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/dogs/withuser?id=5aa720e07dc74c4677a5c313

router.put('/withuser', auth, (req, res, next) => {
    User.findById(req.query.id, (err, userUpdate) => {

        userUpdate.dogs = req.body.dogs
        //console.log(userUpdate.dogs)
        
        for (var item in req.body.dogs){
            userUpdate.dogs[item].name = req.body.dogs[item].name
            userUpdate.dogs[item].age = req.body.dogs[item].age
            userUpdate.dogs[item].breed = req.body.dogs[item].breed
            userUpdate.dogs[item].purebreed = req.body.dogs[item].purebreed
            userUpdate.dogs[item].color = req.body.dogs[item].color
            userUpdate.dogs[item].description = req.body.dogs[item].description
            userUpdate.dogs[item].photos = req.body.dogs[item].photos
        }
        
        userUpdate.save((err, userSave) => {
            if(err){
                next(err);
                return;
            }
            res.json({success: true, result: userSave})
        });
    });
});


module.exports = router;