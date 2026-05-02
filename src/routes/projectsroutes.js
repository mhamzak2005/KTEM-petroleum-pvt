const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { protect } = require('../middleware/auth'); // Import the middleware

// 1. GET: Fetch all projects
// Optional: filter by status using /api/projects?status=completed
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
});

// PUT /api/projects/initialize-scopes
router.get('/penis', async (req, res) => {
  try {
    // $exists: false finds documents that don't have the scopes field yet
    // $set: { scopes: [] } initializes it as an empty array
    const result = await Project.updateMany(
      { scopes: { $exists: false } }, 
      { $set: { scopes: [] } }
    );

    res.status(200).json({
      message: "Projects updated successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error initializing scopes", 
      error: err.message 
    });
  }
});
// 2. PATCH/PUT: Edit a project
// Access via: PATCH /api/projects/def-1 (using your custom string ID)
router.patch('/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { id: req.params.id }, // Find by your custom "def-x" ID
      { $set: req.body },    // Update with the fields sent in request body
      { new: true, runValidators: true } // Return the new object & validate enums
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// 3. DELETE: Remove a project
// Access via: DELETE /api/projects/def-1
router.delete('/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({ id: req.params.id });

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      id: req.params.id
    });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
});
// 2. POST: Create a new project
// Access via: POST /api/projects
router.post('/', async (req, res) => {
  try {
    const {
      id,
      title,
      client,
      location,
      description,
      status,
      year,
      scopes
    } = req.body;

    // Basic validation
    if (!id || !title) {
      return res.status(400).json({ message: "ID and Title are required" });
    }

    // Ensure scopes is always an array of strings
    const safeScopes = Array.isArray(scopes)
      ? scopes.map(s => String(s).trim()).filter(Boolean)
      : [];

    const newProject = new Project({
      id,
      title,
      client,
      location,
      description,
      status,
      year,
      scopes: safeScopes
    });

    await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      project: newProject
    });

  } catch (err) {
    // Handle duplicate ID error (if id is unique in schema)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Project ID already exists"
      });
    }

    res.status(500).json({
      message: "Creation failed",
      error: err.message
    });
  }
});
module.exports = router;
