var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// const cors = require('cors')

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
const tagRouter = require('./routes/tag');
const menuRouter = require('./routes/menu')
const staticRouter = require('./routes/static')

var app = express();

// solely for testing purpose, should comment out after testing
// app.use(cors())

// view engine setup - frontend
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Log
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  // Environment: Development
  app.use(logger('dev', {
    stream: process.stdout
  }));
} else {
  // Environment: Production
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

// post data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie
app.use(cookieParser());
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
});
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'Wjiol_23123_',
  cookie: {
    path: '/', // default conf
    httpOnly: true, // default conf
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}));

// Frontend resources
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html', 'htm'],
}))


// Backend routes
app.use('/', staticRouter)
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)
app.use('/api/tag', tagRouter)
app.use('/api/menu', menuRouter)


// 404 triggered if none of the routes match，forward to Error Handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
