const express = require('express');
const multer = require('multer');
const adminController = require('../controllers/admin');
const router = express.Router();
// const Product = require('../models/product');
// const path = require('path');
// const Store = require('../models/store');
// // Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: '../public/admin/uploads/',
//   filename: function(req, file, cb){
//     cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// })

// // Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// // Init Upload
// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 20*1024*1024},
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// }).single('myImage');



// router.post('/product', upload, (req, res, next) => {  
//   const objProduct = JSON.parse(req.body.data);
//   const title = objProduct.title;
//   const price = objProduct.price;
//   const barcode= objProduct.barcode;
//   const numbers = parseInt(objProduct.numbers);
//   const description = objProduct.description;
  
//   let imgUrl;
//   if (req.file) {
//     imgUrl = req.file.filename
//   }

//   Product.findOne({barcode: barcode}, (err, existProduct) => {
//     if (existProduct) {

//     } else {
//       const createInfo = {};
//       const createTime = new Date();
//       createInfo.createTime = createTime;

//       Store.find({}, {}, {limit: numbers}, (err, posList) => {
//         if (err) {
//           console.log('not found position list'); 
//           return res.json(err);
//         } 
//         const positionList = posList.map(item => {
//           return {
//              row: item.row,
//              floor: item.floor,
//              index: item.index
//             };
//          });
//          console.log("list position");
//          console.log(positionList);
//          const newProduct = new Product({
//           title,
//           imgUrl,
//           price,
//           numbers,
//           barcode,
//           description,
//           position: positionList,
//           createInfo
//         });
//         newProduct.save( {} ,(err, product) => {
//           if (!err) {
//             console.log('create new product sucess');
//             console.log(product);
//             res.json({
//               'message': 'Create product sucess',
//               ...product
//             }); 
//           } else {
//             console.log('create fail');
//             console.log(err);
//           }
//         });  
//       })
//     }
//   });
// }
//   );

router.get('/getProducts', adminController.getPagProducts)

router.get('/product/:id', adminController.getDetailProduct);

router.put('/product/:id', adminController.putProduct);

router.delete('/product/:id', adminController.deleteProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

module.exports = router;


