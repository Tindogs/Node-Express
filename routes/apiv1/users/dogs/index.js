'use strict';

var express = require('express');
var router = express.Router({ mergeParams: true });

const auth = require('../../../../lib/auth');

/* Find Dogs By UserId */
// GET HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253/dogs
router.get('/', auth, require('./dogs-by-user'));

/* New Dog By UserId */
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253/dogs
// Body content like this:
// {
//     "likes_from_others": [],
//     "photos": [],
//     "name": "Dog's name",
//     "age": XX,
//     "breed": "Dog´s breed",
//     "purebreed": false,
//     "color": "Dog´s color",
//     "description": "Dog's Description",
// }
router.put('/', auth, require('./dog-register'));

/* Update Dog By UserId and DogsId */
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253/dogs/5ab7c85875b8dcb2053db1e0
// Body content like this:
// {
//     "likes_from_others": [],
//     "photos": [],
//     "name": "Dog's name",
//     "breed": "Dog´s breed",
//     "purebreed": false,
//     "color": "Dog´s color",
//     "description": "Dog's Description",
//     "queryage": 99,
//     "querymaxkms": 99,
//     "queryreproductive": false,
//     "querybreed": "Dog`s breed"
// }
router.put('/:dogId', auth, require('./dog-update'));

/* Find Dogs By UserId, DogId */
// GET HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253/dogs/5ab7c85875b8dcb2053db1e0/search
router.get('/:dogId/search', auth, require('./dog-search'));

/* Return matches By UserId, DogId */
// GET HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253/dogs/5ab7c85875b8dcb2053db1e0/match
router.get('/:dogId/matches', auth, require('./dog-matches'));

/* Like Dog By UserId, DogsId and OtherDogsId*/
// PUT HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// Send object at body with a raw application/json content type
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253/dogs/5ab7c85875b8dcb2053db1e0/like/5ab7c85875b8dcb20525ghd
// Body content like this:
// {
//     "like": true/false
// }
router.put('/:dogId/like/:otherDogId', auth, require('./dog-like'));

module.exports = router;