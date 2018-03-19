'use strict';

var express = require('express');
var router = express.Router();
const User = require('../../models/User')

const sha      = require('sha256');
const tokens   = require('../../lib/tokens');

const auth = require('../../lib/auth');

/* Find User By UserId */
// GET HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253
router.get('/:id', auth, (req, res, next) => {

    User.findById(req.params.id, (err, users) => {
        if (err) {
            next(err);
            return
        }

        res.json({ success: true, result: users });

    });
});


/* user registration */
// POST HTTP METHOD
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/users/register
// Body content like this:
// {
//     "first_name" : "Chiquito",
//     "last_name" : "de la Calzada",
//     "email" : "chiquito@barbate.com",
//     "username" : "Chiquito",
//     "password" : "fistro"
//   }
router.post('/register', (req, res, next) => {
    
    const user = new User(req.body);
    
    user.password = sha.x2(user.password);  
    user.save((err, userSave) => {
        if(err){
            next(err);
            return;
        }
        res.json({ success: true, token: tokens.createToken(user), result: userSave  }); 
    });
});


/* Update User */
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253
// Body content like this:
// {
// 	"first_name" : "Lucas",
// 	"last_name" : "Grijander",
// 	"email" : "lucas@barbate.com",
// 	"username" : "Lucas",
// 	"password" : "nopuedorl",
// 	"coordinates" : [
//         37.356471,
// 		-5.981709
// 	]
// }
router.put('/:id', auth, (req, res, next) => {
    
    User.findById(req.params.id, (err, userUpdate) => {
        userUpdate.first_name = req.body.first_name;
        userUpdate.last_name = req.body.last_name;
        userUpdate.email = req.body.email
        userUpdate.username = req.body.username
        userUpdate.password = sha.x2(req.body.password)
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
                console.log(data)
                //res.json({success: true, token: tokens.createToken(data), username: data.username, userid: data._id, dogs: data.dogs});
                res.json({success: true, token: tokens.createToken(data), result:data});
            });
        }
});

module.exports = router;