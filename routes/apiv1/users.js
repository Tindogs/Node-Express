'use strict';

var express = require('express');
var router = express.Router();
const User = require('../../models/User')

const sha      = require('sha256');
const tokens   = require('../../lib/tokens');

/* GET /apiv1/users */
router.get('/', (req, res, next) => {
    User.find().exec((err, users) => {
        if (err) {
            next(err);
            return
        }

        res.json({ success: true, result: users });

    });
});

// Find User By UserId
router.get('/:id', (req, res, next) => {
    User.findById(req.params.id, (err, users) => {
        if (err) {
            next(err);
            return
        }

        res.json({ success: true, result: users });

    });
});

// Find Dogs By UserId
router.get('/dogs/:id', (req, res, next) => {
    User.findById(req.params.id, (err, users) => {
        if (err) {
            next(err);
            return
        }

        res.json({ success: true, result: users.dogs });

    });
});

/* POST /apiv1/users */
router.post('/', (req, res, next) => {
    //console.log(req.body);
    const user = new User(req.body);
    
    user.password = sha.x2(user.password);  
    user.save((err, userSave) => {
        if(err){
            next(err);
            return;
        }
        res.json({ success: true, result: userSave, token: tokens.createToken(user) }); 
    });
});

router.post('/authenticate', (req, res, next)=>{
    const user = req.body;
    const password = sha.x2(user.password)
    if(user){                      //hay algo en el body...
            User.findOne({email: req.body.email}).exec((err, data)=>{
                if (err){
                    return (next(err));
                }
                if (data === null){                      //no devuelve nada por ese email
                    return(res.sendStatus(401));
                }
                if (data.password !== sha.x2(user.password)){    // tiene que coincidir usuario y pass
                    return (res.sendStatus(401));
                }
                // console.log(data);
                res.json({success: true, token: tokens.createToken(data), username: data.username, dogs: data.dogs});
            });
        }
});

/* New Dog or Update Dog By UserId */
router.put('/dogs/:id', (req, res, next) => {
    User.findById(req.params.id, (err, userUpdate) => {

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


/* Update User */
router.put('/:id', (req, res, next) => {
    User.findById(req.params.id, (err, userUpdate) => {
        userUpdate.first_name = req.body.first_name;
        userUpdate.last_name = req.body.last_name;
        userUpdate.email = req.body.email
        userUpdate.username = req.body.username
        userUpdate.password = req.body.password
        userUpdate.coordinates = req.body.coordinates
        
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