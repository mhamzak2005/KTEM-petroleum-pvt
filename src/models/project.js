const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  client: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  // Adding the scopes array here
  scopes: { 
    type: [String], 
    default: [] 
  },
  status: { 
    type: String, 
    enum: ['completed', 'ongoing', 'inline'], 
    required: true 
  },
  year: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
