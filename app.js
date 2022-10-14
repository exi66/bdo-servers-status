var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engine = require('ejs-locals');
var favicon = require('serve-favicon');

var indexRouter = require(path.join(__dirname, 'routes', 'index'));
var apiRouter = require(path.join(__dirname, 'routes', 'api'));

var app = express();

//custom data
app.locals.host = 'http://mkdir.tk/';
app.locals.appname = 'bdo-servers-status';
app.locals.client = {
  debug: process.env.NODE_ENV === 'development',
  maintenance: process.env.NODE_SHUTDOWN === 'maintenance',
  status: {},
  someDown: false,
  news: []
}

if (!app.locals.client.debug) console.log = function () { };

//utils
var downDetector = require(path.join(__dirname, 'utils', 'ping'))(app.locals.client);
var newsScraper = require(path.join(__dirname, 'utils', 'news'))(app.locals.client);

var scheduledFunctions = require(path.join(__dirname, 'utils', 'schedule'));
scheduledFunctions.initScheduledJobs(app.locals.client);

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (app.locals.client.debug) app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : { status: 500, message: 'Internal error' };

  // render the error page
  res.status(err.status);
  res.render('error');
});

module.exports = app;
