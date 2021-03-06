var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var db_article = require('./routes/db_article');
var db_member = require('./routes/db_member');
var db_keyword = require('./routes/db_keyword');
var db_scrap = require('./routes/db_scrap');
var db_realtime = require('./routes/db_realtime');
var db_scrap_folder = require('./routes/db_scrap_folder');
var db_keyword_log = require('./routes/db_keyword_log');
//var db_test = require('./routes/db_test');
// var crawler_controller = require('./routes/crawler_controller');

var app = express();
var nodeadmin = require('nodeadmin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setup
app.set('port', process.env.PORT || 80);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/article', db_article);
app.use('/member', db_member);
app.use('/keyword', db_keyword);
app.use('/scrap', db_scrap);
app.use('/realtime', db_realtime);
app.use('/folder', db_scrap_folder);
app.use('/log', db_keyword_log);
//app.use('/db_test', db_test);
//app.use('/crawler', crawler_controller);

app.use(nodeadmin(app));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;

var server = app.listen(app.get('port'), function() {
console.log('Express server listening on port ' + server.address().port);
});
