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
const upload = multer({
  storage: storage,
  limits:{fileSize: 20*1024*1024},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

app.post('/admin/product', upload,async (req, res, next) => {  
  const objProduct = JSON.parse(req.body.data);
  const title = objProduct.title;
  const price = objProduct.price;
  const barcode= objProduct.barcode;
  const numbers = parseInt(objProduct.numbers);
  const description = objProduct.description; 
  let imgUrl;
  if (req.file) {
    imgUrl = req.file.filename
  }
  let positionList;
  try{
    const product = await Product.findOne({barcode: barcode});
    if (product) { // sản phẩm đã tồn tại.
      positionList = await Store.find({ isEmpty: true }).limit(numbers);
      console.log(positionList);
      const posList = positionList.map(item => {
        return {
          row: item.row,
          floor: item.floor,
          index: item.index
        };
      });
      let tempArr = [...product.position];
      tempArr = tempArr.concat(posList);
      product.position = tempArr;
      console.log('product');
      console.log(product);
      product.numbers = product.numbers + numbers;
      const result = await product.save();
      positionList.forEach(item => {
        item.isEmpty = false;
        item.barcode = product.barcode;
      });
      for (let i = 0; i < positionList.length; i++) {
        await positionList[i].save();
      }
      console.log(positionList);
      // await positionList.save();
      console.log(result);
      res.json({
        "message": "Update product success",
        result: result
      });
    }  else {
      const createInfo = {};
      const createTime = new Date();
      createInfo.createTime = createTime;
      positionList = await Store.find({ isEmpty: true }).limit(numbers);
      console.log(positionList);
      const posList = positionList.map(item => {
        return {
          row: item.row,
          floor: item.floor,
          index: item.index
        };
      });
      const newProduct = new Product({
        title,
        imgUrl,
        price,
        numbers,
        barcode,
        description,
        position: posList,
        createInfo
      });
      const result =  await newProduct.save();
      positionList.forEach(item => {
        item.isEmpty = false;
        item.barcode = barcode;
      });
      
      for (let i = 0; i < positionList.length; i++) {
        await positionList[i].save();
      }
      console.log(positionList);
      // await positionList.save();
      console.log(result);
      res.json({
        'message': 'Create product success',
        ...result
      });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
});

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


