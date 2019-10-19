const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const notFound = require('./controllers/404');
const User = require('./models/user');
const Product = require('./models/product');
const constant = require('./utils/constant');
const app = express();
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/admin/uploads/',
  filename: function (req, file, cb) {
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

mongoose
  .connect(constant.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {
    console.log('Connected database!');
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Bang',
          email: 'bang@bang.com',
          role: 'admin'
        });
        user.save();
      }
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .then(() => {
    console.log('The application listenning at port 3000');
  })
  .catch(err => console.log(err));



const adminData = require('./routes/admin');

app.use((req, res, next) => {
  User.findById('5d96e3e3e272b738281a4d8e')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminData);
app.use(notFound.notFound);

