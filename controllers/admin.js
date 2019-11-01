const Product = require('../models/product');
const Store = require('../models/store');

exports.createProduct = async (req, res, next) => {  
  console.log('nó phi vào đây này.');
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
}

exports.updateProduct = async (req, res, next) => {
  console.log('Nhảy vào đây nè, edit product');
  const prodId = req.params.id;
  const objProduct = JSON.parse(req.body.data);
  const title = objProduct.title;
  const price = objProduct.price;
  const barcode= objProduct.barcode;
  const description = objProduct.description; 
  let imgUrl;
  if (req.file) {
    imgUrl = req.file.filename
  }
  
  try {
    const pro = await Product.findById(prodId);
    console.log('result find in edit');
    console.log(pro);
    pro.title = title;
    // Nếu như barcode có sự thay đổi thì phải làm như sau.active
    if (pro.barcode !== barcode) {
      const positionList = await Store.find({barcode: pro.barcode});
      for(let i = 0; i < positionList.length; i++) {
        positionList[i].barcode = barcode;
        await positionList[i].save();
      }
      pro.barcode = barcode;
    }
    pro.price = price;
    if (imgUrl) {
      pro.imgUrl = imgUrl;
    }
    pro.description = description;
    console.log(pro);
    const result = await pro.save();
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
}

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
    const result = await Product.findOne({ barcode: barcode });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
};

exports.getProductWithBarcodeAndNumbers = async (req, res, next) => {
  const barcode = req.params.barcode;
  const numbers = parseInt(req.params.numbers);
  try {
    const product = await Product.findOne({ barcode: barcode});
    let remainingAmount = parseInt(product.numbers);
    let posList;
    let canTake;
  if (remainingAmount > numbers) {
    posList = product.position.slice(0, remainingAmount - 1);
    product.position = product.position.slice(numbers, remainingAmount);
    product.numbers = remainingAmount - numbers;
    canTake = numbers;
  } else {
    posList = product.position;
    product.position = [];
    product.numbers = 0;
    canTake = remainingAmount;
  }
  await product.save();
  const dbPostList = await Store.find({ barcode: barcode }).limit(canTake);
  for (let i = 0; i < dbPostList.length; i++) {
    dbPostList[i].barcode = null;
    dbPostList[i].isEmpty = true;
    await dbPostList[i].save();
  }
  res.json({
    title: product.title,
    price: product.price,
    numbers: canTake,
    description: product.description,
    barcode: product.barcode,
    position: posList
  })
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
}

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