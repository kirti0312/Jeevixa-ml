const express = require('express');
const router = express.Router();

// Calculate green score
router.post('/', async (req, res) => {
  try {
    const { energyUsage, solarOutput, co2Emissions, wasteGenerated, waterUsage } = req.body;

    // Each factor contributes to green score
    const energyScore = Math.max(0, 100 - (energyUsage / 50));
    const solarScore = Math.min(100, (solarOutput / 200) * 100);
    const co2Score = Math.max(0, 100 - (co2Emissions * 20));
    const wasteScore = Math.max(0, 100 - (wasteGenerated * 5));
    const waterScore = Math.max(0, 100 - (waterUsage / 10));

    // Weighted average
    const greenScore = Math.round(
      (energyScore * 0.25) +
      (solarScore * 0.25) +
      (co2Score * 0.20) +
      (wasteScore * 0.15) +
      (waterScore * 0.15)
    );

    let status = 'Poor';
    let color = 'red';
    if (greenScore >= 70) { status = 'Excellent'; color = 'green'; }
    else if (greenScore >= 50) { status = 'Good'; color = 'yellow'; }
    else if (greenScore >= 30) { status = 'Average'; color = 'orange'; }

    res.json({
      greenScore,
      status,
      color,
      breakdown: {
        energyScore: Math.round(energyScore),
        solarScore: Math.round(solarScore),
        co2Score: Math.round(co2Score),
        wasteScore: Math.round(wasteScore),
        waterScore: Math.round(waterScore)
      },
      recommendation: greenScore < 50
        ? 'Switch to solar priority mode and reduce HVAC usage'
        : 'Hospital is operating sustainably. Keep it up!'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get default green score with dummy data
router.get('/', async (req, res) => {
  res.json({
    greenScore: 72,
    status: 'Excellent',
    color: 'green',
    breakdown: {
      energyScore: 75,
      solarScore: 80,
      co2Score: 70,
      wasteScore: 65,
      waterScore: 68
    },
    recommendation: 'Hospital is operating sustainably. Keep it up!'
  });
});

module.exports = router;