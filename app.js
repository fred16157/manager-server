var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var booksRouter = require('./routes/books');
var searchRouter = require('./routes/search');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//var logger = morgan('dev');
var Log = require('./models/log');

var logger = function(req, res, next) {
  var log = new Log();
  log.timestamp = new Date();
  log.method = req.method;
  log.route = req.url;
  res.on('finish', function() {
    log.code = res.statusCode;
    console.log(log.timestamp + " " + req.method + " " + req.url + " " + res.statusCode);
    log.save(function(err) {
      if(err) return console.log(err);
    });
  });
  next();
}

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/books', booksRouter);
app.use('/search', searchRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var mongoose = require("mongoose");
var db = mongoose.connection;
db.on('error', console.error);

db.once('open', function() {
    console.log("데이터베이스에 연결됨");
    Log.remove({}, function(err){
      if(err) return console.log(err);
    });
});

var fs = require('fs');
global.config = JSON.parse(fs.readFileSync('config.json'));

mongoose.connect('mongodb://ubuntu@ec2-13-209-89-75.ap-northeast-2.compute.amazonaws.com/book-manager');

module.exports = app;