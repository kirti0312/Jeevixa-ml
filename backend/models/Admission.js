const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  condition: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium' 
  },
  department: { type: String, required: true },
  equipmentNeeded: [{ type: String }],
  assignedBed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', default: null },
  assignedWard: { type: String, default: null },
  admissionTime: { type: Date, default: Date.now },
  dischargeTime: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ['admitted', 'discharged', 'critical'],
    default: 'admitted' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);