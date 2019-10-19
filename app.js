const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var passport = require('passport');
const multer = require('multer');
const bodyParser = require('body-parser');

const notFound = require('./controllers/404');
const User = require('./models/user');
const Product = require('./models/product');
const constant = require('./utils/constant');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const app = express();
app.use(passport.initialize());
require('./authentication/passport');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');


mongoose
  .connect(constant.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {
    console.log('Connected database!');
  })
  .then(() => {
    app.listen(3000);
  })
  .then(() => {
    console.log('The application listenning at port 3000');
  })
  .catch(err => console.log(err));

app.use((req, res, next) => {
  next();
});

app.use('/admin', adminRouter);
app.use('/user', userRouter)
app.use(notFound.notFound);

