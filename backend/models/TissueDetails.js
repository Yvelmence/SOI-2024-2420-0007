// models/TissueDetails.js
const mongoose = require('mongoose');

const tissueSchema = new mongoose.Schema({
  organ: { type: String, required: true },
  description: { type: String, required: true },
  histology: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});


const Tissue = mongoose.model('Tissue', tissueSchema);

module.exports = Tissue;