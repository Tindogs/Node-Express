'use strict';

const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.ObjectId;

// Esquema User
const matchSchema = mongoose.Schema({
    dog_1: {
        id_dog_matched: ObjectId,
        name_dog_matched: String,
        img_dog_matched: String
    },
    dog_2: {
        id_dog_matched: ObjectId,
        name_dog_matched: String,
        img_dog_matched: String
    },
    conversation: ObjectId
    
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;