const mongoose = require('mongoose');
const Pod = require('./Pod');

const groupSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  color: { type: String, unique: true, required: true },
  icon: { type: String, required: true },
  children: [Pod],
  parent: mongoose.Schema.Types.ObjectId,
  members: [mongoose.Schema.Types.ObjectId]

}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
