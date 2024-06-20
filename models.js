const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  assigned_to: { type: String },
  status_text: { type: String },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  open: { type: Boolean, default: true }
});



module.exports = {issueSchema};

