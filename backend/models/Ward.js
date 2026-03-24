const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  occupancy: { type: Number, default: 0 },
  totalBeds: { type: Number, default: 20 },
  occupiedBeds: { type: Number, default: 0 },
  lastDisinfection: { type: Date, default: Date.now },
  airQuality: { type: Number, default: 80 },
  handHygiene: { type: Number, default: 85 },
  activeInfections: { type: Number, default: 0 },
  department: { type: String, required: true },
  equipment: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Ward', wardSchema);