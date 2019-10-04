const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const notFound = require('./controllers/404');
const mongoose = require('mongoose');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


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

mongoose
  .connect(
    'mongodb+srv://admin:admin@cluster0-zvyb6.mongodb.net/products'
  )
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

