const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  propertyId: { type: String, required: true },
  propertyName: { type: String },
  message: { type: String },
  platform: { type: String }, // email, whatsapp, etc
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Share', shareSchema);
