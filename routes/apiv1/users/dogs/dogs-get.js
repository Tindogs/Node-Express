'use strict';
const User = require('../../../../models/User');


module.exports = function (req, res, next) {
    let userId = req.params.id;
    let dogId = req.params.dogId;

  

    User.findById(userId)
        .then(user => { 
           
            let dogResult = user.dogs.filter(dog => dog._id.toString() === dogId.toString());
            res.json({ success: true, result: dogResult });
        }).catch((err) => {
            next(err);
            return;
        });
};
