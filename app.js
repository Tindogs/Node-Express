'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const winston = require('winston');
// Cargamos Custom Errors
const CustomError = require('./lib/CustomError');

// //Configuramos la utilidad de log
winston.add(winston.transports.File, {
    name: 'error-file',
    filename: './logs/errors.json',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    level: 'error'
});


winston.add(winston.transports.File, {
    name: 'info-file',
    filename: './logs/info.json',
    level: 'info'
});


// Mongoose - Model
require('./lib/connectMongoose');
require('./models/User');
require('./models/Match');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ENABLE CORS
// https://enable-cors.org/index.html
app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
    next();
});

// WEB
app.use('/', require('./routes/index'));

//API
app.use('/apiv1/users', require('./routes/apiv1/users'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (isApi(req)) {

        winston.error('Error %s, status: %d', err.message, err.status);

        if (err instanceof CustomError) {
            const culture = req.query.culture || req.body.culture;
            res.json(err.toPrettyObject(culture));
        } else {
            res.json({ success: false, error: err.message });
        }
        return;
    }
  
  // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    res.render('error');
});

// Comprueba si estamos recibiendo una petición para la ruta /api
function  isApi(req){
    return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
