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



/* New Dog By UserId */
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/dogs/withuser/5aa997a2d5d9b8046a908253
// Body content like this:
// {
//     "likes_from_others": [],
//     "photos": [],
//     "name": "Dog's name",
//     "age": XX,
//     "breed": "Dog´s breed",
//     "purebreed": false,
//     "color": "Dog´s color",
//     "description": "Dog's Description",
// }
router.put('/withuser/:id', auth, (req, res, next) => {
    let userId = req.params.id;

    var dog = {
        'name': req.body.name,
        'age': req.body.age,
        'breed': req.body.breed,
        'purebreed': req.body.purebreed,
        'color': req.body.color,
        'description': req.body.description,
        'photos': req.body.photos
    }

    User.findByIdAndUpdate(userId, {$addToSet:{dogs: dog}}, {upsert:true, new: true}, (err, dogSave) => {
        if(err){
            next(err);
            return;
        };
        
        res.json({success: true, result: dogSave})
    });
});

/* Update Dog By UserId and DogsId */
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/dogs/withuser/5aa997a2d5d9b8046a908253/withdog/5ab7c85875b8dcb2053db1e0
// Body content like this:
// {
//     "likes_from_others": [],
//     "photos": [],
//     "name": "Dog's name",
//     "age": XX,
//     "breed": "Dog´s breed",
//     "purebreed": false,
//     "color": "Dog´s color",
//     "description": "Dog's Description",
// }
router.put('/withuser/:id/withdog/:dogId', auth, (req, res, next) => {
    let userId = req.params.id;
    let dogId = req.params.dogId;
    var dog = {
        'name': req.body.name,
        'age': req.body.age,
        'breed': req.body.breed,
        'purebreed': req.body.purebreed,
        'color': req.body.color,
        'description': req.body.description,
        'photos': req.body.photos
    }

    // console.log(dog);
    // console.log("Id del usuario: " + userId);
    // console.log("Id del Perro: " + dogId);

    User.findOneAndUpdate(
        {"_id": userId, "dogs._id": dogId },
        { $set : { "dogs.$" : dog }},
        {upsert: true, new: true}, (err, userUpdate) => {
        if(err){
            next(err);
            return;
        };
        
        res.json({success: true, result: userUpdate})
    });
});

module.exports = router;