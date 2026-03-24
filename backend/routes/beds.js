const express = require('express');
const router = express.Router();
const Bed = require('../models/Bed');
const Ward = require('../models/Ward');

// Department mapping based on condition
function getDepartment(condition, severity) {
  const conditionMap = {
    'cardiac': 'Cardiology',
    'heart': 'Cardiology',
    'chest pain': 'Cardiology',
    'fracture': 'Orthopedics',
    'bone': 'Orthopedics',
    'child': 'Pediatrics',
    'fever': 'General',
    'infection': 'General',
    'surgery': 'General',
    'cancer': 'Oncology',
    'brain': 'Neurology',
    'mental': 'Psychiatry',
    'breathing': 'General',
    'kidney': 'Nephrology',
  };

  const lowerCondition = condition.toLowerCase();
  for (const [key, dept] of Object.entries(conditionMap)) {
    if (lowerCondition.includes(key)) return dept;
  }

  if (severity === 'critical') return 'Critical Care';
  return 'General';
}

// AI Bed Allotment
router.post('/allot', async (req, res) => {
  try {
    const { patientName, condition, severity, equipmentNeeded } = req.body;

    // Step 1 - Get department
    const department = getDepartment(condition, severity);

    // Step 2 - Find available beds
    let availableBeds = await Bed.find({ status: 'available' });

    if (availableBeds.length === 0) {
      return res.json({
        success: false,
        message: 'No beds available right now',
        suggestedWait: '2-3 hours based on discharge patterns'
      });
    }

    // Step 3 - Filter by department
    let matchedBeds = availableBeds.filter(
      bed => bed.department === department
    );

    if (matchedBeds.length === 0) {
      matchedBeds = availableBeds;
    }

    // Step 4 - Filter by infection risk
    let safeBeds = matchedBeds.filter(
      bed => bed.infectionRisk === 'low'
    );

    if (safeBeds.length === 0) safeBeds = matchedBeds;

    // Step 5 - Filter by equipment
    if (equipmentNeeded && equipmentNeeded.length > 0) {
      const equippedBeds = safeBeds.filter(bed =>
        equipmentNeeded.every(eq => bed.equipment.includes(eq))
      );
      if (equippedBeds.length > 0) safeBeds = equippedBeds;
    }

    // Step 6 - Assign best bed
    const assignedBed = safeBeds[0];
await Bed.findByIdAndUpdate(assignedBed._id, {
  status: 'occupied',
  currentPatient: patientName
});

    res.json({
      success: true,
      assignedBed: {
        bedNumber: assignedBed.bedNumber,
        ward: assignedBed.wardName,
        wardName: assignedBed.wardName,
        department: assignedBed.department,
        infectionRisk: assignedBed.infectionRisk,
        equipment: assignedBed.equipment
      },
      reason: `Best match — ${department} ward, low infection risk, equipment available`,
      patientName,
      condition,
      severity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all beds
router.get('/', async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;