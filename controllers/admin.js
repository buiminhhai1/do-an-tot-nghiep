const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  res.render('admin/products',{
    pageTitle: "Tất cả sản phẩm",
    path: '/admin/products'
  });
};

exports.createProduct =  (req, res, next) => {
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