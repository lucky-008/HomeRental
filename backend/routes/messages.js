const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message about a property
router.post('/send', async (req, res) => {
  const { from, to, propertyId, propertyName, message } = req.body;
  
  if (!from || !to || !propertyId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const newMessage = new Message({
      from,
      to,
      propertyId,
      propertyName,
      message
    });
    await newMessage.save();
    res.json({ success: true, messageId: newMessage._id });
  } catch (err) {
    console.error('Message send error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages for a user
router.get('/inbox/:username', async (req, res) => {
  try {
    const messages = await Message.find({ to: req.params.username })
      .sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
router.put('/read/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

module.exports = router;
