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
    
    user.password = sha.x2(usuario.password);  
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
    if(user){                      //hay usuario y pass
            User.findOne({email: req.body.email}).exec((err, data)=>{
                if (err){
                    next(err);
                    return;
                }
                if (data === null){                      //no devuelve nada por ese email
                    res.sendStatus(401);
                    return;
                }
                if (data.password !== sha.x2(user.password)){    // tiene que coincidir usuario y pass
                    res.sendStatus(401);
                    return;
                }
                res.json({success: true, token: tokens.createToken(data)});
            });
        }
        // siempre devolvemos token para test, borrar en producción
        res.json({success: true, token: tokens.createToken('2811281232138192321321')});
});

module.exports = router;