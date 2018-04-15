'use strict';
const User = require('../../../../models/User');
const Match = require('../../../../models/Match');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (req, res, next) {
    if (req.body.like === 'false') {
        let otherDogId = req.params.otherDogId;
        let dogId = req.params.dogId;
        Promise.all([
            Match.findOneAndRemove({
                $or: [
                    { $and: [{ 'dog_1.id_dog_matched': otherDogId }, { 'dog_2.id_dog_matched': dogId }] },
                    { $and: [{ 'dog_2.id_dog_matched': otherDogId }, { 'dog_1.id_dog_matched': dogId }] }
                ]
            }),
            User.findOne({ 'dogs._id': otherDogId })
        ])  
            .then(results => {
                let otherUser = results[1];
              
                let otherDog = otherUser.dogs.filter(dog => dog._id.toString() === otherDogId.toString())[0];

                let indexOtherDog = otherUser.dogs.indexOf(otherDog);
                
                let like = otherDog.likes_from_others.filter(like => like.dog_like_id.toString() === dogId.toString());
                let indexLike = otherDog.likes_from_others.indexOf(like);

                otherUser.dogs[indexOtherDog].likes_from_others.splice(indexLike, 1);
                return otherUser.save();
               
            }).then(() => {
                res.json({ success: true, result: { match: false } });
            }).catch(err => {
                next(err);
                return;
            });
                
    } else if (req.body.like === 'true') {
        let otherDogId = req.params.otherDogId;
        let dogId = req.params.dogId;
        let userId = req.params.id;
        var isMatch = false;
        Promise.all([User.findOne({ 'dogs._id': otherDogId }), User.findById(userId)])
            .then(results => {
                let otherUser = results[0];
                let myUser = results[1];
                let otherDog = otherUser.dogs.filter(dog => dog._id.toString() === otherDogId.toString())[0];
                let myDog = myUser.dogs.filter(dog => dog._id.toString() === dogId.toString())[0];

                // Está mi perro en el like_from_other del otro perro (es decir, ya le he dado like a este perro)
                let isMyDogInOtherDogsLikes = otherDog.likes_from_others.filter(like => like.dog_like_id.toString() === dogId.toString()).length === 1;
                // Está el otro perro en mis likes
                let isOtherDogInMyDogsLikes = myDog.likes_from_others.filter(like => like.dog_like_id.toString() === otherDogId.toString()).length === 1;
                
                let promises = [];
                if (!isMyDogInOtherDogsLikes) {
                    let indexOtherDog = otherUser.dogs.indexOf(otherDog);
                    let dog_like = {
                        dog_like_id: ObjectId(dogId),
                        dog_name: myDog.name,
                        owner_id: ObjectId(userId),
                        owner_name: myUser.name
                    };
                    otherUser.dogs[indexOtherDog].likes_from_others.push(dog_like);
                    promises.push(otherUser.save());
                }
                
                if (isOtherDogInMyDogsLikes) {
                    // Añadir match
                    let match = {
                        dog_1: 
                        {
                            id_dog_matched: myDog._id,
                            name_dog_matched: myDog.name,
                            img_dog_matched: myDog.photos[0]
                        },
                        dog_2: {
                            id_dog_matched: otherDog._id,
                            name_dog_matched: otherDog.name,
                            img_dog_matched: otherDog.photos[0]
                        }
                    };
                    promises.push(Match(match).save());
                    isMatch = true;
                }
                promises.push(Promise.resolve(isMatch));
                return Promise.all(promises);
            })
            .then(results => {
                
                res.json({ success: true, result: { match: results[results.length - 1] } });
            })
            .catch((err) => {
                next(err);
                return;
            });
    } else { 
        var err = new Error('Field like is not valid. Set like to "true" or "false"');
        err.status = 409;
        next(err);
        return;
    }
  
};