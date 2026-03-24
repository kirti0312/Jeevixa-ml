const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const hour = now.getHours();

    // Pattern based surge prediction
    const hourlyPattern = {
      0: 3, 1: 2, 2: 2, 3: 1, 4: 1, 5: 2,
      6: 5, 7: 8, 8: 12, 9: 15, 10: 14, 11: 13,
      12: 10, 13: 11, 14: 13, 15: 14, 16: 15, 17: 14,
      18: 16, 19: 18, 20: 15, 21: 12, 22: 8, 23: 5
    };

    // Next 4 hours prediction
    const next4Hours = [];
    for (let i = 1; i <= 4; i++) {
      const nextHour = (hour + i) % 24;
      next4Hours.push({
        hour: `${nextHour}:00`,
        expected: hourlyPattern[nextHour],
      });
    }

    const totalExpected = next4Hours.reduce((sum, h) => sum + h.expected, 0);
    const staffNeeded = Math.ceil(totalExpected / 10);

    res.json({
      currentHour: `${hour}:00`,
      next4Hours,
      totalExpected,
      staffRecommendation: `${staffNeeded} extra staff recommended for next 4 hours`,
      alertLevel: totalExpected > 50 ? 'high' : totalExpected > 30 ? 'medium' : 'low'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;