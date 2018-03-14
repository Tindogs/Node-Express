'use strict';

var express = require('express');
var router = express.Router();
const User = require('../../models/User')

const sha      = require('sha256');
const tokens   = require('../../lib/tokens');

const auth = require('../../lib/auth');

/* GET /apiv1/users */
// router.get('/', (req, res, next) => {
//     User.find().exec((err, users) => {
//         if (err) {
//             next(err);
//             return
//         }

//         res.json({ success: true, result: users });

//     });
// });

/* Find User By UserId */
// GET HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// EXAMPLE: http://localhost:3000/apiv1/users/with?id=5aa720e07dc74c4677a5c313

router.get('/with', auth, (req, res, next) => {

    User.findById(req.query.id, (err, users) => {
        if (err) {
            next(err);
            return
        }

        res.json({ success: true, result: users });

    });
});


/* user registration */
// POST HTTP METHOD
// EXAMPLE: 
router.post('/register', (req, res, next) => {
    
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


/* Update User */
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/users/with?id=5aa720e07dc74c4677a5c313
router.put('/with', auth, (req, res, next) => {
    
    User.findById(req.query.id, (err, userUpdate) => {
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


/* Authentication */
// POST HTTP METHOD
// Needs two pairs of key:value items at body, named email and password, 
// Send request with application/x-www-form-urlencoded content type
// EXAMPLE: http://localhost:3000/apiv1/users/authenticate
router.post('/authenticate', (req, res, next)=>{

    console.log(req.body);
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

module.exports = router;