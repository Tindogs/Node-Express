'use strict';
const Match = require('../../../../models/Match');



module.exports = function (req, res, next) {
    let dogId = req.params.dogId;

    Promise.all([Match.find({ 'dog_1.id_dog_matched': dogId }), Match.find({ 'dog_2.id_dog_matched': dogId })])
        .then(results => {
            var response = [];
            response.push(results[0].map(match => match.dog_2));
            let dogsIds = results[0].map(match => match.dog_2.id_dog_matched.toString());
            results[1].forEach(dog_1 => {
                if (dogsIds.indexOf(dog_1.id_dog_matched.toString()) === -1) { 
                    response.push(dog_1);
                }
            });
            
            response.push(results[1].map(match => match.dog_1));
            res.json({ success: true, result: response });
        }).catch((err) => {
            next(err);
            return;
        });
};