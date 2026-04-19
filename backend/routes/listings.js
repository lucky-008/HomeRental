const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Create a new listing
router.post('/create', async (req, res) => {
  const { username, name, location, propertyType, bedrooms, area, salePrice, rentPrice, description, image, listingType, furnishing, possession, phone } = req.body;
  
  if (!username || !name || !location || !propertyType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const listing = new Listing({
      username,
      name,
      location,
      propertyType,
      bedrooms,
      area,
      salePrice,
      rentPrice,
      description,
      image: image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
      listingType,
      furnishing,
      possession,
      phone
    });
    await listing.save();
    res.json({ success: true, listing });
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get listings for a user
router.get('/user/:username', async (req, res) => {
  try {
    console.log(`Fetching listings for user: ${req.params.username}`);
    const listings = await Listing.find({ username: req.params.username })
      .sort({ createdAt: -1 });
    console.log(`Found ${listings.length} listings for ${req.params.username}`);
    res.json({ listings });
  } catch (err) {
    console.error('Failed to fetch listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings', details: err.message });
  }
});

// Delete a listing
router.delete('/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// Get a listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json({ listing });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing', details: err.message });
  }
});

// Get all listings (for properties page)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 });
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

module.exports = router;
