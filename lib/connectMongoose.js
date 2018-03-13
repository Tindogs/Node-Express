'use strict'

const mongoose = require('mongoose');
const conn = mongoose.connection;

conn.on('error', err => {
    console.log('Error de conexión', err);
    process.exit(1);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB');
});

mongoose.connect('mongodb://USER:PASS@localhost:27017/DB');



