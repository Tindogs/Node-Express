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
            
            let dogsIds = [];
            var response= [];
            var dogs = [...results[0].map(match => match.dog_2), ...results[1].map(match => match.dog_1)];
           
            dogs.forEach(dog => {

                if (dogsIds.indexOf(dog.id_dog_matched.toString()) === -1) { 
                    response.push(dog);
                    dogsIds.push(dog.id_dog_matched.toString());
                }
            });
            
           
            res.json({ success: true, result: response });
        }).catch((err) => {
            next(err);
            return;
        });
};