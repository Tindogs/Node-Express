'use strict';

var express = require('express');
var router = express.Router();
const User = require('../../models/User')

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
    user.save((err, userSave) => {
        if(err){
            next(err);
            return;
        }
        res.json({ success: true, result: userSave }); 
    })
})

module.exports = router;