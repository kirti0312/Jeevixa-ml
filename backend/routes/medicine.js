const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Get all medicines with expiry status
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const result = medicines.map(med => {
      const daysUntilExpiry = Math.ceil((new Date(med.expiryDate) - now) / (1000 * 60 * 60 * 24));
      const isExpired = daysUntilExpiry < 0;
      const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
      const wasteCost = isExpired ? med.quantity * med.costPerUnit : 0;

      return {
        name: med.name,
        quantity: med.quantity,
        expiryDate: med.expiryDate,
        ward: med.ward,
        daysUntilExpiry,
        isExpired,
        isExpiringSoon,
        wasteCost,
        status: isExpired ? 'expired' : isExpiringSoon ? 'expiring' : 'ok',
        wasteGenerated: med.wasteGenerated,
        co2Impact: (med.wasteGenerated * 2.5).toFixed(2)
      };
    });

    const totalWasteCost = result.reduce((sum, m) => sum + m.wasteCost, 0);
    const totalCo2 = result.reduce((sum, m) => sum + parseFloat(m.co2Impact), 0);

    res.json({
      medicines: result,
      summary: {
        totalMedicines: result.length,
        expiredCount: result.filter(m => m.isExpired).length,
        expiringSoonCount: result.filter(m => m.isExpiringSoon).length,
        totalWasteCost: totalWasteCost.toFixed(2),
        totalCo2Impact: totalCo2.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;