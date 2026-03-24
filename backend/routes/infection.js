const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');

// Calculate infection risk score for a ward
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
    const result = wards.map(ward => ({
      wardName: ward.name,
      department: ward.department,
      occupancy: ward.occupancy,
      activeInfections: ward.activeInfections,
      airQuality: ward.airQuality,
      handHygiene: ward.handHygiene,
      lastDisinfection: ward.lastDisinfection,
      ...calculateInfectionRisk(ward)
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;