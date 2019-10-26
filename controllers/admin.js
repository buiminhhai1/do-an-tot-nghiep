const Product = require('../models/product');
const Store = require('../models/store');

exports.getProducts = (req, res, next) => {
  res.render('admin/products',{
    pageTitle: "Tất cả sản phẩm",
    path: '/admin/products'
  });
};


exports.getPagProducts = (req, res, next) => {
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
};

exports.getDetailProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId)
    .then(product => {
      console.log(product);
      res.json(product);
    })
    .catch(err => res.json(err));
};

exports.putProduct = (req, res, next) => {
  const prodId = req.params.id;
  const updatedProduct = req.body;
  console.log("log product receive from front end");
  console.log(updatedProduct);
  Product.findByIdAndUpdate(prodId, updatedProduct, (err, doc) => {
    if (err) {
      console.log('catch error update');
      console.log(err);
      return res.json(err);
    }
    console.log(doc);
    return res.json(doc);
  });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.id;
  console.log(req.params);
  console.log(productId);
  Product.findByIdAndDelete(productId,(err, doc) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(doc);
  });
};