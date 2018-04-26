'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;
// Logger
const winston = require('winston');

conn.on('error', err => {
    winston.error('Error de conexión', err);
    process.exit(1);
});

conn.once('open', () => {
    winston.info('Conectado a MongoDB');
});
// Cuando nos desconectamos
conn.on('disconnected', function () {
    winston.info('Mongoose default connection to DB disconnected');
});

const gracefulExit = function () {
    conn.close(function () {
        process.exit(0);
    });
};

// Si termina el proceso de Node, cerramos la conexión
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

mongoose.connect('mongodb://tindog:tindog@localhost/tindogs');
