'use strict';

var express = require('express');
var router = express.Router();
const User = require('../../models/User')

const auth = require('../../lib/auth');


/* Find Dogs By UserId */
// GET HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// EXAMPLE: http://localhost:3000/apiv1/dogs/fromuser/5aa997a2d5d9b8046a908253
router.get('/fromuser/:id', auth,  (req, res, next) => {
    User.findById(req.params.id, (err, users) => {
        if (err) {
            next(err);
            return
        }

        res.json({ success: true, result: users.dogs });

    });
});



/* New Dog or Update Dog By UserId */
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/dogs/withuser/5aa997a2d5d9b8046a908253
// Body content like this:
// {
// "dogs" : [
//     {
//         "likes_from_others": [],
//         "photos": [],
//         "name": "Dog's name",
//         "age": XX,
//         "purebreed": false,
//         "description": "Dog's Description",
//     }, etc.. ]
// }
router.put('/withuser/:id', auth, (req, res, next) => {
    User.findById(req.params.id, (err, userUpdate) => {
        
        userUpdate.dogs = req.body.dogs
        
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