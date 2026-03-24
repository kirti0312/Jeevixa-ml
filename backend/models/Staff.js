const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['doctor', 'nurse', 'technician', 'admin', 'pharmacist'],
    required: true
  },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  shiftStart: { type: String, required: true },
  shiftEnd: { type: String, required: true },
  hoursOnDuty: { type: Number, default: 0 },
  isOnDuty: { type: Boolean, default: false },
  fatigueAlert: { type: Boolean, default: false },
  specialization: { type: String, default: '' },
  joiningDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);