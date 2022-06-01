var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
//CORS - React demo
var cors = require('cors');

var mongoDB = process.env.MONGODB_URI+'/Quizz?retryWrites=true&w=majority';
mongoose.connect(mongoDB,  { useNewUrlParser:true, useUnifiedTopology: true  });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 
	'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/UserRoutes');
var gameRouter = require('./routes/GameRoutes');

var app = express();

const oneDay = 1000 * 60 * 60 * 24;
var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
  secret: 'sadgdhgjhlelktrgsigjtewcxyvxbverts',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
  store: MongoStore.create({ mongoUrl: mongoDB })
}));

var allowedOrigins = ['http://localhost:4200', 
                      'http://localhost:4100', 
                      'http://localhost:3000',
  'https://superquizz.herokuapp.com/'];

app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var authRequired = function (req, res, next){

  if(req.session.user)
    next()
  else
    return res.status(401).json();
}

   
app.use('/', indexRouter);

app.use(authRequired);
//Route defined here now need user to be connected to be accessed
app.use('/user', usersRouter);
app.use('/game', gameRouter);

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
  res.json(res.locals);
});

module.exports = app;
