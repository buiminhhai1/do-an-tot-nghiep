const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// /admin/add-barcode => GET
// router.get('/add-barcode', adminController.getBarcode);

// /admin/barcodes => GET
router.get('/barcodes', adminController.getBarcodes);
module.exports = router;