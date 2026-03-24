const Alert = require('./models/Alert');
const Ward = require('./models/Ward');
const Medicine = require('./models/Medicine');
const Staff = require('./models/Staff');
const Bed = require('./models/Bed');

const generateAlerts = async () => {
  try {
    // Check wards
    const wards = await Ward.find();
    for (const ward of wards) {
      if (ward.occupancy >= 90) {
        const existing = await Alert.findOne({
          message: { $regex: ward.name },
          category: 'bed',
          isResolved: false
        });
        if (!existing) {
          await Alert.create({
            type: 'critical',
            category: 'bed',
            message: `${ward.name} occupancy at ${ward.occupancy}% — immediate action required`,
            ward: ward.name,
            isRead: false,
            isResolved: false
          });
          console.log(`🚨 Alert created for ${ward.name}`);
        }
      }
    }

    // Check medicines
    const medicines = await Medicine.find();
    for (const med of medicines) {
      const days = Math.ceil((new Date(med.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (days <= 7 && days >= 0) {
        const existing = await Alert.findOne({
          message: { $regex: med.name },
          category: 'supply',
          isResolved: false
        });
        if (!existing) {
          await Alert.create({
            type: 'warning',
            category: 'supply',
            message: `${med.name} expiring in ${days} days — ${med.quantity} units remaining`,
            ward: med.ward,
            isRead: false,
            isResolved: false
          });
          console.log(`⚠️ Alert created for ${med.name}`);
        }
      }
    }

    // Check staff fatigue
    const staff = await Staff.find({ isOnDuty: true });
    for (const member of staff) {
      if (member.hoursOnDuty >= 10) {
        const existing = await Alert.findOne({
          message: { $regex: member.name },
          category: 'staff',
          isResolved: false
        });
        if (!existing) {
          await Alert.create({
            type: 'warning',
            category: 'staff',
            message: `${member.name} on duty for ${member.hoursOnDuty}+ hours — fatigue risk high`,
            ward: member.department,
            isRead: false,
            isResolved: false
          });
          console.log(`⚠️ Fatigue alert for ${member.name}`);
        }
      }
    }

    // Check infection risk
    for (const ward of wards) {
      if (ward.activeInfections >= 2) {
        const existing = await Alert.findOne({
          message: { $regex: ward.name },
          category: 'infection',
          isResolved: false
        });
        if (!existing) {
          await Alert.create({
            type: 'critical',
            category: 'infection',
            message: `${ward.name} has ${ward.activeInfections} active infections — isolation protocol recommended`,
            ward: ward.name,
            isRead: false,
            isResolved: false
          });
          console.log(`🦠 Infection alert for ${ward.name}`);
        }
      }
    }

  } catch (err) {
    console.error('Alert generator error:', err);
  }
};

module.exports = generateAlerts;