'use strict';

const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.ObjectId

// Esquema User
const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    username: String,
    password: String,
    coordinates: [Number],
    photo: String,
    dogs: [{
        name: String,
        age: Number,
        breed: String,
        purebreed: Boolean,
        color: String,
        query: { age: String, max_kms: Number, reproductive: Boolean, breed: String },
        likes_from_others: [{
            dog_like_id: ObjectId,
            dog_name: String,
            owner_id: ObjectId,
            owner_name: String
        }],
        description: String,
        photos: [String]
    }]    
})

const User = mongoose.model('User', userSchema);

module.exports = User;