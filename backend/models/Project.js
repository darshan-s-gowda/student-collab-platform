const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  tech_stack: [{ type: String }],
  required_skills: [{ type: String }],
  required_members: { type: Number, default: 1 },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);
