const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  details: [{
    key: String,
    items: [String],
    materials: [String]
  }]
});

module.exports = mongoose.model('Service', serviceSchema);