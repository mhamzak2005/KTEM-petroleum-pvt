const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { protect } = require('../middleware/auth');

// 1. GET: Fetch all projects
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

// Admin Utility Route
router.get('/penis', async (req, res) => {
  try {
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
    res.status(500).json({ message: "Error initializing scopes", error: err.message });
  }
});

// 2. PATCH/PUT: Edit a project
router.patch('/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { id: req.params.id }, 
      { $set: req.body },    
      { new: true, runValidators: true } 
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

// 4. POST: Create a new project (ID and Location are now OPTIONAL)
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

    // VALIDATION: Only Title is strictly required for the database to start a record
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Ensure scopes is always an array
    const safeScopes = Array.isArray(scopes)
      ? scopes.map(s => String(s).trim()).filter(Boolean)
      : [];

    const newProject = new Project({
      // If id is missing, generate a temporary one based on timestamp
      id: id || `proj_${Date.now()}`, 
      title,
      client: client || "",
      location: location || "", // Made optional
      description: description || "",
      status: status || "completed",
      year: year || new Date().getFullYear().toString(),
      scopes: safeScopes
    });

    await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      project: newProject
    });

  } catch (err) {
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
