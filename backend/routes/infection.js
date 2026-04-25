const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');
const axios = require('axios');

// Calculate infection risk score for a ward (fallback)
function calculateInfectionRisk(ward) {
  const occupancyScore = ward.occupancy * 0.30;
  const disinfectionHours = Math.abs(new Date() - new Date(ward.lastDisinfection)) / 36e5;
  const disinfectionScore = Math.min(disinfectionHours, 24) * 0.25;
  const infectionScore = ward.activeInfections * 10 * 0.25;
  const airScore = (100 - ward.airQuality) * 0.10;
  const hygieneScore = (100 - ward.handHygiene) * 0.10;

  const total = occupancyScore + disinfectionScore + infectionScore + airScore + hygieneScore;

  let risk = 'low';
  if (total > 60) risk = 'high';
  else if (total > 30) risk = 'medium';

  return { score: Math.min(Math.round(total), 100), risk };
}

// Get infection risk for all wards
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.find();
    const result = [];

    for (let ward of wards) {
      try {
        const hours =
          Math.abs(new Date() - new Date(ward.lastDisinfection)) / 36e5;

        // 🔥 ML CALL
        const response = await axios.post(
          'http://localhost:5001/predict/infection',
          {
            occupancy: ward.occupancy,
            activeInfections: ward.activeInfections,
            airQuality: ward.airQuality,
            handHygiene: ward.handHygiene,
            hoursSinceDisinfection: hours
          }
        );

        result.push({
          wardName: ward.name,
          department: ward.department,
          occupancy: ward.occupancy,
          activeInfections: ward.activeInfections,
          airQuality: ward.airQuality,
          handHygiene: ward.handHygiene,
          lastDisinfection: ward.lastDisinfection,
          risk: response.data.risk,
          score:
            response.data.risk === "high" ? 80 :
            response.data.risk === "medium" ? 50 : 20,
          source: "ML"
        });

      } catch (err) {
        console.log("ML failed, using fallback");

        const fallback = calculateInfectionRisk(ward);

        result.push({
          wardName: ward.name,
          department: ward.department,
          occupancy: ward.occupancy,
          activeInfections: ward.activeInfections,
          airQuality: ward.airQuality,
          handHygiene: ward.handHygiene,
          lastDisinfection: ward.lastDisinfection,
          ...fallback,
          source: "fallback"
        });
      }
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;