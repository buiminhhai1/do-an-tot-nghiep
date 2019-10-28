const Product = require('../models/product');
const Store = require('../models/store');
// redicrect to view 
exports.getAdminPage = (req, res, next) => {
  res.render('admin/products',{
    pageTitle: "Tất cả sản phẩm",
    path: '/admin/products'
  });
};
// get view all product
exports.getProducts = (req, res, next) => {
  res.render('admin/products',{
    pageTitle: "Tất cả sản phẩm",
    path: '/admin/products'
  });
};

exports.getPagProducts = async (req, res, next) => {
  let pageNo = parseInt(req.query.pageNo);
  let size = parseInt(req.query.size);
  let query = {};
  if (pageNo < 0 || pageNo === 0) {
    pageNo = 1;
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  try{
    const result = await Product.find({}, {}, query);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const result = await Product.find();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
};

exports.getDetailProduct = async (req, res, next) => {
  const prodId = req.params.id;
  try {
    const result = await Product.findById(prodId)
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
};

exports.getDetailProductByBarcode = async (req, res, next) => {
  const barcode = req.params.barcode;
  try {
    const result = await Product.find({ barcode: barcode });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
};



exports.putProduct = async (req, res, next) => {
  const prodId = req.params.id;
  const updatedProduct = req.body;
  try {
    const reuslt = await Product.findByIdAndUpdate(prodId, updatedProduct);
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const barcode = req.params.barcode;
  console.log('barcode');
  console.log(barcode);
  try{
    const positionList = await Store.find({barcode: barcode});
    for (let i = 0; i < positionList.length; i++) {
      positionList[i].barcode = null;
      positionList[i].isEmpty = true;
      await positionList[i].save();
    }
    const result = await Product.findByIdAndDelete(productId);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
};