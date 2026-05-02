const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    categoryLabel: String,
    desc: String,
    params: String,
    image: String,
    pdfPage: Number
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);