const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth'); // Import the middleware

// 1. GET ALL
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ id: 1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. POST — Create new
router.post('/',protect, async (req, res) => {
  console.log('--- Incoming Service POST ---');
  console.log('Request Body:', req.body);
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 3. PUT — Update existing
router.put('/:id', protect, async (req, res) => {
  console.log('--- Incoming Service PUT ---', req.params.id);
  console.log('Request Body:', req.body);
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 4. DELETE
router.delete('/:id', protect, async (req, res) => {
  console.log('--- Incoming Service DELETE ---', req.params.id);
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;