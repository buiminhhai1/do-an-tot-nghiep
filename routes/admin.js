const express = require('express');
const multer = require('multer');
const adminController = require('../controllers/admin');
const router = express.Router();
// ---------------- GET HERE ------------------
router.get('/', adminController.getAdminPage);

router.get('/getProducts', adminController.getPagProducts)

router.get('/allProducts', adminController.getAllProducts);

router.get('/product/:id', adminController.getDetailProduct);

router.get('/product/barcode/:barcode', adminController.getDetailProductByBarcode);

router.get('/product/barcode/:barcode/numbers/:numbers', adminController.getProductWithBarcodeAndNumbers);
// ---------- PUT here --------------------
router.post('/product', adminController.createProduct)

router.put('/products/product/:id', adminController.updateProduct);

// --------------- DELETE HERE -----------------------
router.delete('/product/:id/barcode/:barcode', adminController.deleteProduct);

// get view all products. in list
router.get('/products', adminController.getProducts);

module.exports = router;


