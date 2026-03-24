const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
  wardName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available' 
  },
  equipment: [{ type: String }],
  infectionRisk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  currentPatient: { type: String, default: null },
  department: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bed', bedSchema);