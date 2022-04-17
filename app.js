const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const keys = require('./server/config/keys')
const bodyParser = require('body-parser');
const passport = require('passport')
const indexRouter = require('./server/routes/index');
const apiRouter = require('./server/api/routes');

const app = express();
app.locals.moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'jade');

// app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const MongoStore = require('connect-mongo')(session);

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(error))

const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' });

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: keys.jwt,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day 
  }
}));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())


require('./server/middleware/passport')
require('./server/middleware/jwt-auth')
// This will initialize the passport object on every request
app.use(passport.initialize());
app.use(passport.session());

app.get('/admin/*', (req, res) => {
  res.sendFile(
    path.resolve(
      __dirname, 'public', 'admin', 'index.html'
    )
  )
})

app.get('/uploads/*', (req, res) => {
  res.sendFile(
    path.resolve(
      __dirname, req.path,
    )
  )
})

// app.get('/admin', (req, res) => {
//   res.sendFile(
//     path.resolve(
//       'admin', 'index.html'
//     )
//   )
// })
app.use('/', indexRouter);
app.use('/api', apiRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
