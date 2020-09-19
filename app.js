var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
const indexRouter = require('./routes/index');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const infoRouter = require('./routes/info');
const logoutRouter = require('./routes/logout');
var app = express();

app.use(cors())
app.use(express.json())
app.use('/', indexRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/info', infoRouter);
app.use('/logout', logoutRouter);

app.use(function (req, res, next) {
  next(createError(404));
});


module.exports = app;
