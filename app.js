const express = require('express');
const path = require('path');
const multer = require('multer')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var passport = require('passport');
const bodyParser = require('body-parser');
const notFound = require('./controllers/404');
const constant = require('./utils/constant');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const indexRouter = require('./routes/index');
const app = express();
app.use(passport.initialize());
require('./authentication/passport');

app.use(logger('dev'));
const Product = require('./models/product');
const Store = require('./models/store');
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/admin/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init Upload
app.use(multer({
  storage: storage,
  limits:{fileSize: 20*1024*1024},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/admin/uploads')));
// console.log(__dirname + '/public/admin/upload');
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRouter);
app.use('/user', userRouter)
app.use('/', indexRouter);
app.use(notFound.notFound);

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


