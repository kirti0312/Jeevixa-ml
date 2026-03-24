const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  ward: { type: String, required: true },
  costPerUnit: { type: Number, required: true },
  category: { type: String, required: true },
  supplier: { type: String, default: 'General Supplier' },
  reorderLevel: { type: Number, default: 50 },
  unit: { type: String, default: 'units' },
  wasteGenerated: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);