const mongoose = require('mongoose');

const podSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  color: { type: String, unique: true, required: true },
  icon: { type: String, required: true },
  parent: mongoose.Schema.Types.ObjectId,
  members: [mongoose.Schema.Types.ObjectId]
}, { timestamps: true });

const Pod = mongoose.model('Group', podSchema);

module.exports = Pod;
