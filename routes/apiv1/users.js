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
    })
})

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

module.exports = router;