const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('admin/products',{
    pageTitle: "Tất cả sản phẩm",
    path: '/admin/products'
  });
})

module.exports = router;