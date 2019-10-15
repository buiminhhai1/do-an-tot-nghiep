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
const app = express();
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

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



const adminData = require('./routes/admin');

app.post('/admin/products', upload, (req, res, next) => {
  console.log('access app.js!');
  const title = req.body.title;
  // chỉnh lại một chút const imgUrl = req.file.filename;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const barcode = req.body.barcode;
  const description = req.body.description;

  const product = new Product({
    title,
    imgUrl,
    price,
    barcode,
    description
  });
  console.log(product);

  product.save()
    .then((result) => {
      console.log("create product");
      res.json(product);
    })
    .catch(err => {
      console.log(err);
      const error = new Error("failed to insert supplier document");
      error.status = 400;
      next(error);
    });
});

app.get('/admin/product/:id', (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then(product => {
      res.json(product);
    })
    .catch(err => res.json(err));
});

app.get('/admin/getAllProducts', (req, res, next) => {
  let pageNo = parseInt(req.query.pageNo);
  let size = parseInt(req.query.size);
  let query = {};
  if (pageNo < 0 || pageNo === 0) {
    pageNo = 1;
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  Product.find({}, {}, query, (err, docs) => {
    if (err) {
      console.log(err);
       res.status(400).json({err});
    } 
     res.json(docs);
  });
})

app.put('/admin/product/:id', upload, (req, res, next) => {
  const prodId = req.params.id;

  const updatedProduct = req.body.data;
  console.log(req.body);
  if (req.file) {
    updatedProduct.imgUrl = req.file.filename;
  }
  console.log('update product');
  console.log(updatedProduct);
  Product.findByIdAndUpdate(prodId, req.body
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
});

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

