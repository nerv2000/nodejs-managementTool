const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();

////////////////////////////////////////////////////////////////////////////////

// 설정 파일 읽어오기 
const config = require('./lib/config').load();

// 오래된 세션 파일 삭제
const oldSessionFileDelete = require('./lib/oldSessionFileDelete');
oldSessionFileDelete.oldSessionFileDeleteSync('./sessions');

// handerlbar helper 연결
const hbs = require('hbs');
const hbsHelper = require('./lib/handlebarsHelper');
hbs.registerHelper("ifCond", hbsHelper.ifCond);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// logger
app.use(logger('dev'));

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 보내는 데이터 압축 해주는 미들웨어
app.use(compression());

// 보안관련
app.use(helmet());

// 접근 가능한 폴더 연결 
app.use(express.static(path.join(__dirname, 'public')));

// startbootstrap-sb-admin 에서 접근하는 폴더 연결 
app.use('/css', express.static(__dirname + '/node_modules/startbootstrap-sb-admin/css'));
app.use('/js', express.static(__dirname + '/node_modules/startbootstrap-sb-admin/js'));
app.use('/vendor', express.static(__dirname + '/node_modules/startbootstrap-sb-admin/vendor'));

// session 설정 
app.use(session({
  secret: config.session.secret
  , resave: false
  , saveUninitialized: true
  , httpOnly: true
  , store: new FileStore()
  , cookie: {
    maxAge: config.session.cookie.maxAge
  }
}));

// 라우터 연결 
const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const userRouter = require('./routes/user');
const authenticationRouter = require('./routes/authentication');

app.use('/', indexRouter);
app.use('/', authenticationRouter);
app.use('/dashboard', dashboardRouter);
app.use('/user', userRouter );

/////////////////////////////////////////////////////////////////////////////////
// 에러 페이지
/////////////////////////////////////////////////////////////////////////////////
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout: false} );
});

/////////////////////////////////////////////////////////////////////////////////

module.exports = app;
