const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hero', HeroSchema);
