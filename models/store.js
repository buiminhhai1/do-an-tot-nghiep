const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
  row: {
    type: Number,
    require: true
  },
  floor: {
    type: Number,
    required: false
  },
  index: {
    type: Number,
    required: true
  },
  isEmpty: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Store', storeSchema);