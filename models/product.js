const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  imgUrl: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  numbers: {
    type: Number,
    required: true
  },
  barcode: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  position: {
    type: Object,
    required: true
  },
  createInfo: {
    type: Object,
    required: true
  },
  updateInfo: {
    type: Object, 
    required: false
  }
});

module.exports = mongoose.model('Product', productSchema);