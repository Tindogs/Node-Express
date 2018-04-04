'use strict';

var express = require('express');
var router = express.Router();
const auth = require('../../../lib/auth');

/* Find User By UserId */
// GET HTTP METHOD
// Needs a valid token, a pair of key:value named token at the header
// EXAMPLE: http://localhost:3000/apiv1/users/5aa997a2d5d9b8046a908253
router.get('/:id', auth, require('./get-user-by-id'));

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
router.post('/register', require('./user-register'));

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

router.put('/:id', auth, require('./user-update'));

/* Authentication */
// POST HTTP METHOD
// Needs two pairs of key:value items at body, named email and password, 
// Send request with application/x-www-form-urlencoded content type
// EXAMPLE: http://localhost:3000/apiv1/users/authenticate
router.post('/authenticate', require('./user-authentication'));

router.use('/:id/dogs', require('./dogs'));
module.exports = router;