const express = require('express');
const router = express.Router();
const axios = require('axios');
const Ward = require('../models/Ward');
const Bed = require('../models/Bed');
const Medicine = require('../models/Medicine');

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    // Collect live hospital data
    const wards = await Ward.find();
    const beds = await Bed.find();
    const medicines = await Medicine.find();

    const availableBeds = beds.filter(b => b.status === 'available').length;
    const occupiedBeds = beds.filter(b => b.status === 'occupied').length;

    const expiringMedicines = medicines.filter(m => {
      const days = Math.ceil((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days >= 0;
    });

    const hospitalContext = `You are Jeevixa AI — a smart hospital management assistant.

WARDS (${wards.length} total):
${wards.map(w => `- ${w.name}: ${w.occupancy}% occupancy, ${w.activeInfections} infections`).join('\n')}

BEDS:
- Total: ${beds.length}
- Available: ${availableBeds}
- Occupied: ${occupiedBeds}

MEDICINES EXPIRING (${expiringMedicines.length}):
${expiringMedicines.map(m => `- ${m.name} expiring on ${new Date(m.expiryDate).toDateString()}`).join('\n')}

Answer clearly in 2-3 lines.
Question: ${question}`;

    const response = await axios({
      method: 'post',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        contents: [
          {
            parts: [{ text: hospitalContext }]
          }
        ]
      }
    });

    // ✅ SAFE parsing (VERY IMPORTANT)
    const answer =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({ answer });

  } catch (error) {
    console.error('Chatbot error:', error.response?.data || error.message);

    res.status(500).json({
      message: 'Chatbot error',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;