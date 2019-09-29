const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next) => {
  next();
});

app.use('/admin', adminData);
app.listen(3000);