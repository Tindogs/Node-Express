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

        res.json({ success: true, result: users });

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
    User.findById(req.params.id, (err, dogsUpdate) => {
        if(err){
            next(err);
            return;
        }
        
        dogsUpdate.dogs = req.body.dogs
        
        for (var item in req.body.dogs){
            if (req.body.dogs[item].name && req.body.dogs[item].age && req.body.dogs[item].breed && req.body.dogs[item].purebreed && req.body.dogs[item].color && req.body.dogs[item].description && req.body.dogs[item].photos !== undefined){
                dogsUpdate.dogs[item].name = req.body.dogs[item].name;
                dogsUpdate.dogs[item].age = req.body.dogs[item].age;
                dogsUpdate.dogs[item].breed = req.body.dogs[item].breed;
                dogsUpdate.dogs[item].purebreed = req.body.dogs[item].purebreed;
                dogsUpdate.dogs[item].color = req.body.dogs[item].color;
                dogsUpdate.dogs[item].description = req.body.dogs[item].description;
                dogsUpdate.dogs[item].photos = req.body.dogs[item].photos;
            }

        }
        
        dogsUpdate.save((err, dogSave) => {
            if(err){
                next(err);
                return;
            }
            res.json({success: true, result: dogSave})
        });
    });
});


module.exports = router;