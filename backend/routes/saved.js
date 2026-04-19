const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Save a property for a user
router.post('/save', async (req, res) => {
  const { username, propertyId } = req.body;
  if (!username || !propertyId) return res.status(400).json({ error: 'Missing username or propertyId' });
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $addToSet: { savedProperties: propertyId } },
      { new: true, upsert: true }
    );
    res.json({ savedProperties: user.savedProperties });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save property' });
  }
});

// Unsave a property for a user
router.post('/unsave', async (req, res) => {
  const { username, propertyId } = req.body;
  if (!username || !propertyId) return res.status(400).json({ error: 'Missing username or propertyId' });
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $pull: { savedProperties: propertyId } },
      { new: true }
    );
    res.json({ savedProperties: user ? user.savedProperties : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unsave property' });
  }
});

// Get saved properties for a user
router.get('/saved/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.json({ savedProperties: user ? user.savedProperties : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved properties' });
  }
});

module.exports = router;
