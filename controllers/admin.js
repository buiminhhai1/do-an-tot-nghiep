exports.getBarcodes = (req, res, next) => {
  res.render('admin/barcode-list',{
    pageTitle: "All Barcodes",
    path: '/admin/barcodes'
  })
};