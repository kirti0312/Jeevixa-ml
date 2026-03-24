const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['critical', 'warning', 'info'],
    required: true
  },
  category: {
    type: String,
    enum: ['bed', 'infection', 'energy', 'supply', 'staff', 'patient', 'system'],
    required: true
  },
  message: { type: String, required: true },
  ward: { type: String, default: 'General' },
  isRead: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
  resolvedBy: { type: String, default: null },
  resolvedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);