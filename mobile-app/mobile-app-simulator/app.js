const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login')

require('dotenv').config()

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/register', registerRouter);

module.exports = app;
