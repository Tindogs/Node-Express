'use strict';
const Match = require('../../../../models/Match');

function removeDuplicates(arr) {
    let unique_array = [];
    for (let i = 0; i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) === -1) {
            unique_array.push(arr[i]);
        }
    }
    return unique_array;
}


module.exports = function (req, res, next) {
    let dogId = req.params.dogId;

    Promise.all([Match.find({ 'dog_1.id_dog_matched': dogId }), Match.find({ 'dog_2.id_dog_matched': dogId })])
        .then(results => {
            
            var response= results[0].map(match => match.dog_2);
          
            let dogsIds = results[0].map(match => match.dog_2.id_dog_matched.toString());
           
            results[1].forEach(match => {

                if (dogsIds.indexOf(match.dog_1.id_dog_matched.toString()) === -1) { 
                    response.push(match.dog_1);
                }
            });
            
           
            res.json({ success: true, result: removeDuplicates(response) });
        }).catch((err) => {
            next(err);
            return;
        });
};