var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
const tagRouter = require('./routes/tag');
const menuRouter = require('./routes/menu')

var app = express();

// view engine setup // 前端内容
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 日志
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  // 开发环境 或 测试环境
  app.use(logger('dev', {
    stream: process.stdout
  }));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}
// post 数据
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
    path: '/', // 默认配置
    httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}));
// 前端资源
app.use(express.static(path.join(__dirname, 'public')));

// 路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)
app.use('/api/tag', tagRouter)
app.use('/api/menu', menuRouter)


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

module.exports = app;
