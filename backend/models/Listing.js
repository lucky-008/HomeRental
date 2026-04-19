const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  propertyType: { type: String, required: true },
  bedrooms: { type: Number },
  area: { type: Number },
  salePrice: { type: Number },
  rentPrice: { type: Number },
  description: { type: String },
  image: { type: String },
  listingType: { type: String, enum: ['buy', 'rent', 'both'], default: 'both' },
  furnishing: { type: String, enum: ['Furnished', 'Semifurnished', 'Unfurnished'], default: 'Unfurnished' },
  possession: { type: String, default: 'Immediate' },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
