const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ isOnDuty: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add new staff
router.post('/add', async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update duty status
router.put('/:id/duty', async (req, res) => {
  try {
    const { isOnDuty, hoursOnDuty } = req.body;
    const fatigueAlert = hoursOnDuty >= 10;

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { isOnDuty, hoursOnDuty, fatigueAlert },
      { new: true }
    );

    res.json({
      success: true,
      staff,
      fatigueAlert,
      message: fatigueAlert
        ? `⚠️ ${staff.name} has been on duty for ${hoursOnDuty} hours!`
        : 'Status updated'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get staff on duty
router.get('/on-duty', async (req, res) => {
  try {
    const staff = await Staff.find({ isOnDuty: true });
    res.json({
      count: staff.length,
      staff,
      fatigueAlerts: staff.filter(s => s.fatigueAlert).length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;