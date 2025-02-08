// models/TissueList.js
const mongoose = require('mongoose');

const tissueListSchema = new mongoose.Schema({
  organName: {
    type: String,
    required: true,
  },
});

const TissueList = mongoose.model('TissueList', tissueListSchema);

module.exports = TissueList;