const Product = require('../models/product');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// /admin/products => GET
router.get('/products', adminController.getProducts);

router.post('/product', adminController.createProduct);

router.get('/getProducts', adminController.getPagProducts)

router.get('/product/:id', adminController.getDetailProduct);

router.put('/product/:id', adminController.putProduct);

router.delete('/product/:id', adminController.deleteProduct);

module.exports = router;



