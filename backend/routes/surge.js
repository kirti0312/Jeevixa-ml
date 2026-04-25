const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    const next4Hours = [];

    for (let i = 1; i <= 4; i++) {
      const nextHour = (hour + i) % 24;

      let prediction;

      try {
        const response = await axios.post('http://localhost:5001/predict', {
          hour: nextHour,
          day: day
        });

        prediction = response.data.prediction;

// add variation (±3)
        const variation = Math.floor(Math.random() * 7) - 3;
        prediction = Math.max(1, prediction + variation);
        console.log("ML prediction:", prediction);

      } catch (err) {
        console.log("ML service failed, using fallback");

        const hourlyPattern = {
          0: 3, 1: 2, 2: 2, 3: 1, 4: 1, 5: 2,
          6: 5, 7: 8, 8: 12, 9: 15, 10: 14, 11: 13,
          12: 10, 13: 11, 14: 13, 15: 14, 16: 15, 17: 14,
          18: 16, 19: 18, 20: 15, 21: 12, 22: 8, 23: 5
        };

        prediction = hourlyPattern[nextHour];
      }

      next4Hours.push({
        hour: `${nextHour}:00`,
        expected: prediction
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