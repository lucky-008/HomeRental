const express = require('express');
const router = express.Router();
const Share = require('../models/Share');

// Share a property
router.post('/share', async (req, res) => {
  const { from, to, propertyId, propertyName, message, platform } = req.body;
  
  if (!from || !to || !propertyId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const newShare = new Share({
      from,
      to,
      propertyId,
      propertyName,
      message,
      platform
    });
    await newShare.save();
    res.json({ success: true, shareId: newShare._id });
  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({ error: 'Failed to share property' });
  }
});

// Get shares for a user
router.get('/shares/:username', async (req, res) => {
  try {
    const shares = await Share.find({ to: req.params.username })
      .sort({ createdAt: -1 });
    res.json({ shares });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shares' });
  }
});

module.exports = router;
