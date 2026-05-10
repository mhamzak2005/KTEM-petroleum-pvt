const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const { protect } = require('../middleware/auth');

// GET: Fetch the current image
router.get('/', async (req, res) => {
    try {
        const hero = await Hero.findOne();
        // Return an array to keep it consistent with your React .map() logic
        res.json({ status: true, data: hero ? [hero] : [] });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});

// POST: Update the image address
router.post('/update',protect, async (req, res) => {
    const { imageUrl } = req.body;
    
    try {
        const updated = await Hero.findOneAndUpdate(
            {}, // Empty filter finds the first available document
            { imageUrl, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json({ status: true, message: 'Hero image updated!', data: updated });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
});

// SEED: Set the initial default image
// Access this once via: https://your-api-url.com/hero/seed

module.exports = router;
