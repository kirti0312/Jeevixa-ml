const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  condition: { type: String, required: true },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  department: { type: String, required: true },
  assignedBed: { type: String, default: null },
  assignedWard: { type: String, default: null },
  equipmentNeeded: [{ type: String }],
  bloodGroup: { type: String, default: 'Unknown' },
  allergies: [{ type: String }],
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date, default: null },
  status: {
    type: String,
    enum: ['admitted', 'discharged', 'critical', 'under observation'],
    default: 'admitted'
  },
  notes: { type: String, default: '' },
  attendingDoctor: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);