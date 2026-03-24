const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get unread alerts count
router.get('/unread', async (req, res) => {
  try {
    const count = await Alert.countDocuments({ isRead: false });
    const critical = await Alert.countDocuments({
      isRead: false,
      type: 'critical'
    });
    res.json({ count, critical });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create new alert
router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Mark alert as read
router.put('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Mark alert as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        isResolved: true,
        resolvedBy: req.body.resolvedBy,
        resolvedAt: new Date()
      },
      { new: true }
    );
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Mark all as read
router.put('/read-all', async (req, res) => {
  try {
    await Alert.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;