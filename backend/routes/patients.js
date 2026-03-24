const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Bed = require('../models/Bed');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Register new patient
router.post('/register', async (req, res) => {
  try {
    const {
      name, age, gender, phone, address,
      condition, severity, department,
      equipmentNeeded, bloodGroup,
      allergies, notes, attendingDoctor
    } = req.body;

   const patient = new Patient({
  name, age, gender, phone, address,
  condition, severity, department,
  equipmentNeeded, bloodGroup,
  allergies, notes, attendingDoctor,
  assignedBed: req.body.assignedBed || null,
  assignedWard: req.body.assignedWard || null,
});
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update patient status
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Discharge patient
router.put('/:id/discharge', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        status: 'discharged',
        dischargeDate: new Date()
      },
      { new: true }
    );

    // Free the bed
    if (patient.assignedBed) {
      await Bed.findOneAndUpdate(
        { bedNumber: patient.assignedBed },
        { status: 'available', currentPatient: null }
      );
    }

    res.json({ success: true, message: 'Patient discharged', patient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single patient
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;