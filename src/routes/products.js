const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const { protect } = require('../middleware/auth'); // Import the middleware

// @route   GET /api/products
// @desc    Get all products
router.get('/', async (req, res) => {
    try {
        // .sort({ pdfPage: 1 }) orders by pdfPage ascending
        const products = await Product.find().sort({ pdfPage: 1 }); 
        
        res.json({ status: true, data: products });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});

// @route   GET /api/products/:category
// @desc    Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json({ status: true, data: products });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});

// @route   GET /api/products/item/:id
// @desc    Get single product details
router.get('/item/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ status: false, message: 'Product not found' });
        res.json({ status: true, data: product });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});
// @route   POST /api/products
// @desc    Create a new product
// @route   POST /api/products
router.post('/',protect, async (req, res) => {
    // FIX: Just take the fields directly from req.body
    // Since your frontend is now sending 'name', 'desc', and 'imageUrl'
    const { name, category, desc, imageUrl, params } = req.body;

    const newProduct = new Product({
        name,
        category,
        desc,
        image: imageUrl, // Mapping imageUrl to your schema's 'image' field if necessary
        params
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json({ status: true, data: savedProduct });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
});

// @route   PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
    try {
        // Ensure the mapping for 'image' happens here too if your schema uses 'image'
        const updateData = { ...req.body };
        if (updateData.imageUrl) {
            updateData.image = updateData.imageUrl;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({ status: false, message: 'Not found' });
        res.json({ status: true, data: updatedProduct });
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }

        res.json({ status: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});
module.exports = router;