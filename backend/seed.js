const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');
const Ward = require('./models/Ward');
const Bed = require('./models/Bed');
const Medicine = require('./models/Medicine');
const Admission = require('./models/Admission');
const User = require('./models/User');
const Staff = require('./models/Staff');
const Alert = require('./models/Alert');
const Patient = require('./models/Patient');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Ward.deleteMany();
    await Bed.deleteMany();
    await Medicine.deleteMany();
    await Admission.deleteMany();
    await User.deleteMany();
    await Staff.deleteMany();
    await Alert.deleteMany();
    await Patient.deleteMany();
    console.log('🗑️ Cleared old data');

    // Create Wards
    const wards = await Ward.insertMany([
      { name: 'ICU', department: 'Critical Care', occupancy: 94, totalBeds: 20, occupiedBeds: 19, lastDisinfection: new Date(Date.now() - 3 * 60 * 60 * 1000), airQuality: 72, handHygiene: 88, activeInfections: 2 },
      { name: 'General Ward A', department: 'General', occupancy: 72, totalBeds: 50, occupiedBeds: 36, lastDisinfection: new Date(Date.now() - 1 * 60 * 60 * 1000), airQuality: 85, handHygiene: 91, activeInfections: 1 },
      { name: 'General Ward B', department: 'General', occupancy: 68, totalBeds: 50, occupiedBeds: 34, lastDisinfection: new Date(Date.now() - 2 * 60 * 60 * 1000), airQuality: 87, handHygiene: 90, activeInfections: 0 },
      { name: 'Cardiology', department: 'Cardiology', occupancy: 81, totalBeds: 30, occupiedBeds: 24, lastDisinfection: new Date(Date.now() - 2 * 60 * 60 * 1000), airQuality: 88, handHygiene: 93, activeInfections: 0 },
      { name: 'Pediatrics', department: 'Pediatrics', occupancy: 65, totalBeds: 25, occupiedBeds: 16, lastDisinfection: new Date(Date.now() - 4 * 60 * 60 * 1000), airQuality: 90, handHygiene: 95, activeInfections: 3 },
      { name: 'Orthopedics', department: 'Orthopedics', occupancy: 70, totalBeds: 20, occupiedBeds: 14, lastDisinfection: new Date(Date.now() - 2 * 60 * 60 * 1000), airQuality: 83, handHygiene: 89, activeInfections: 0 },
      { name: 'Oncology', department: 'Oncology', occupancy: 55, totalBeds: 20, occupiedBeds: 11, lastDisinfection: new Date(Date.now() - 1 * 60 * 60 * 1000), airQuality: 92, handHygiene: 96, activeInfections: 1 },
      { name: 'Neurology', department: 'Neurology', occupancy: 60, totalBeds: 20, occupiedBeds: 12, lastDisinfection: new Date(Date.now() - 5 * 60 * 60 * 1000), airQuality: 80, handHygiene: 87, activeInfections: 0 },
      { name: 'Emergency', department: 'Emergency', occupancy: 91, totalBeds: 30, occupiedBeds: 27, lastDisinfection: new Date(Date.now() - 6 * 60 * 60 * 1000), airQuality: 75, handHygiene: 82, activeInfections: 2 },
      { name: 'Maternity', department: 'Maternity', occupancy: 78, totalBeds: 25, occupiedBeds: 19, lastDisinfection: new Date(Date.now() - 1 * 60 * 60 * 1000), airQuality: 93, handHygiene: 97, activeInfections: 0 },
      { name: 'Psychiatry', department: 'Psychiatry', occupancy: 50, totalBeds: 20, occupiedBeds: 10, lastDisinfection: new Date(Date.now() - 3 * 60 * 60 * 1000), airQuality: 86, handHygiene: 88, activeInfections: 0 },
      { name: 'Nephrology', department: 'Nephrology', occupancy: 63, totalBeds: 20, occupiedBeds: 13, lastDisinfection: new Date(Date.now() - 2 * 60 * 60 * 1000), airQuality: 84, handHygiene: 90, activeInfections: 1 },
    ]);
    console.log('🏥 12 Wards created');

    // Create Beds
    const bedData = [];
    const deptConfig = [
      { dept: 'Critical Care', ward: 0, equip: ['ventilator', 'monitor', 'oxygen'] },
      { dept: 'General', ward: 1, equip: ['monitor'] },
      { dept: 'General', ward: 2, equip: ['oxygen'] },
      { dept: 'Cardiology', ward: 3, equip: ['monitor', 'defibrillator'] },
      { dept: 'Pediatrics', ward: 4, equip: ['monitor', 'oxygen'] },
      { dept: 'Orthopedics', ward: 5, equip: [] },
      { dept: 'Oncology', ward: 6, equip: ['monitor', 'chemotherapy pump'] },
      { dept: 'Neurology', ward: 7, equip: ['monitor', 'eeg machine'] },
      { dept: 'Emergency', ward: 8, equip: ['ventilator', 'monitor', 'defibrillator'] },
      { dept: 'Maternity', ward: 9, equip: ['monitor', 'oxygen'] },
      { dept: 'Psychiatry', ward: 10, equip: [] },
      { dept: 'Nephrology', ward: 11, equip: ['dialysis', 'monitor'] },
    ];

    deptConfig.forEach(({ dept, ward, equip }) => {
      for (let j = 1; j <= 10; j++) {
        const prefix = dept.substring(0, 3).toUpperCase();
        bedData.push({
          bedNumber: `${prefix}-${String(j).padStart(2, '0')}`,
          ward: wards[ward]._id,
          wardName: wards[ward].name,
          status: j <= 7 ? 'occupied' : j === 8 ? 'maintenance' : 'available',
          equipment: equip,
          infectionRisk: ward === 0 || ward === 8 ? 'high' : ward === 1 || ward === 4 ? 'medium' : 'low',
          department: dept,
          currentPatient: j <= 7 ? `Patient ${prefix}-${j}` : null
        });
      }
    });
    await Bed.insertMany(bedData);
    console.log('🛏️ 120 Beds created');

    // Create Medicines
    await Medicine.insertMany([
      { name: 'Paracetamol 500mg', quantity: 500, expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), ward: 'General Ward A', costPerUnit: 2, category: 'Analgesic', wasteGenerated: 0.5 },
      { name: 'IV Saline 500ml', quantity: 200, expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), ward: 'ICU', costPerUnit: 45, category: 'IV Fluid', wasteGenerated: 1.2 },
      { name: 'Amoxicillin 250mg', quantity: 300, expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), ward: 'General Ward A', costPerUnit: 8, category: 'Antibiotic', wasteGenerated: 0.8 },
      { name: 'Insulin 100IU', quantity: 150, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), ward: 'Cardiology', costPerUnit: 120, category: 'Hormone', wasteGenerated: 0.3 },
      { name: 'Morphine 10mg', quantity: 80, expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), ward: 'ICU', costPerUnit: 200, category: 'Analgesic', wasteGenerated: 0.2 },
      { name: 'Aspirin 75mg', quantity: 1000, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), ward: 'Cardiology', costPerUnit: 1, category: 'Antiplatelet', wasteGenerated: 0.4 },
      { name: 'Metformin 500mg', quantity: 400, expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), ward: 'General Ward B', costPerUnit: 5, category: 'Antidiabetic', wasteGenerated: 0.6 },
      { name: 'Oxygen Cylinder', quantity: 20, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), ward: 'ICU', costPerUnit: 500, category: 'Gas', wasteGenerated: 2.0 },
      { name: 'Atorvastatin 10mg', quantity: 600, expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), ward: 'Cardiology', costPerUnit: 12, category: 'Statin', wasteGenerated: 0.3 },
      { name: 'Ondansetron 4mg', quantity: 250, expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), ward: 'Oncology', costPerUnit: 25, category: 'Antiemetic', wasteGenerated: 0.4 },
      { name: 'Heparin 5000IU', quantity: 100, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), ward: 'ICU', costPerUnit: 180, category: 'Anticoagulant', wasteGenerated: 0.2 },
      { name: 'Dexamethasone 4mg', quantity: 180, expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), ward: 'Emergency', costPerUnit: 35, category: 'Steroid', wasteGenerated: 0.5 },
      { name: 'Ceftriaxone 1g', quantity: 120, expiryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), ward: 'General Ward A', costPerUnit: 95, category: 'Antibiotic', wasteGenerated: 0.7 },
      { name: 'Diazepam 5mg', quantity: 200, expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), ward: 'Psychiatry', costPerUnit: 15, category: 'Benzodiazepine', wasteGenerated: 0.3 },
      { name: 'Furosemide 40mg', quantity: 350, expiryDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000), ward: 'Nephrology', costPerUnit: 8, category: 'Diuretic', wasteGenerated: 0.4 },
      { name: 'Oxytocin 10IU', quantity: 90, expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), ward: 'Maternity', costPerUnit: 65, category: 'Hormone', wasteGenerated: 0.2 },
      { name: 'Phenytoin 100mg', quantity: 160, expiryDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), ward: 'Neurology', costPerUnit: 20, category: 'Anticonvulsant', wasteGenerated: 0.3 },
      { name: 'Omeprazole 20mg', quantity: 800, expiryDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000), ward: 'General Ward B', costPerUnit: 6, category: 'PPI', wasteGenerated: 0.5 },
      { name: 'Vancomycin 500mg', quantity: 60, expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), ward: 'ICU', costPerUnit: 280, category: 'Antibiotic', wasteGenerated: 0.6 },
      { name: 'Calcium Gluconate', quantity: 140, expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), ward: 'Nephrology', costPerUnit: 40, category: 'Electrolyte', wasteGenerated: 0.4 },
      { name: 'Adrenaline 1mg', quantity: 50, expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), ward: 'Emergency', costPerUnit: 150, category: 'Emergency Drug', wasteGenerated: 0.1 },
      { name: 'Methotrexate 2.5mg', quantity: 200, expiryDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000), ward: 'Oncology', costPerUnit: 45, category: 'Chemotherapy', wasteGenerated: 1.5 },
      { name: 'Surgical Gloves M', quantity: 80, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), ward: 'General Ward A', costPerUnit: 5, category: 'Consumable', wasteGenerated: 0.8 },
      { name: 'N95 Masks', quantity: 1500, expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), ward: 'ICU', costPerUnit: 25, category: 'PPE', wasteGenerated: 1.2 },
      { name: 'IV Dextrose 5%', quantity: 175, expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), ward: 'General Ward B', costPerUnit: 55, category: 'IV Fluid', wasteGenerated: 1.0 },
    ]);
    console.log('💊 25 Medicines created');

    // Create Admission History (30 days)
    const admissionData = [];
    const conditions = ['Cardiac Arrest', 'Fracture', 'Fever', 'Infection', 'Cancer Treatment', 'Brain Injury', 'Emergency', 'Pregnancy', 'Mental Health', 'Kidney Failure'];
    const departments = ['Cardiology', 'Orthopedics', 'General', 'General', 'Oncology', 'Neurology', 'Emergency', 'Maternity', 'Psychiatry', 'Nephrology'];
    const severities = ['low', 'medium', 'high', 'critical'];

    for (let day = 30; day >= 0; day--) {
      const admissionsPerDay = Math.floor(Math.random() * 20) + 10;
      for (let i = 0; i < admissionsPerDay; i++) {
        const idx = Math.floor(Math.random() * conditions.length);
        admissionData.push({
          patientName: `Patient ${day}-${i}`,
          age: Math.floor(Math.random() * 70) + 10,
          condition: conditions[idx],
          severity: severities[Math.floor(Math.random() * severities.length)],
          department: departments[idx],
          equipmentNeeded: [],
          admissionTime: new Date(Date.now() - day * 24 * 60 * 60 * 1000),
          status: day > 0 ? 'discharged' : 'admitted'
        });
      }
    }
    await Admission.insertMany(admissionData);
    console.log('📋 30 days admission history created');

    // Create 3 Users
const hashedAdmin = await bcrypt.hash('admin123', 10);
const hashedDoctor = await bcrypt.hash('doctor123', 10);
const hashedNurse = await bcrypt.hash('nurse123', 10);

await User.insertMany([
  { name: 'Admin Jeevixa', email: 'admin@jeevixa.com', password: hashedAdmin, role: 'admin', department: 'Administration' },
  { name: 'Dr. Priya Sharma', email: 'doctor@jeevixa.com', password: hashedDoctor, role: 'doctor', department: 'Cardiology' },
  { name: 'Nurse Rahul', email: 'nurse@jeevixa.com', password: hashedNurse, role: 'nurse', department: 'ICU' },
]);
    console.log('👥 3 Users created');
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('Admin  → admin@jeevixa.com / admin123');
    console.log('Doctor → doctor@jeevixa.com / doctor123');
    console.log('Nurse  → nurse@jeevixa.com / nurse123');
    console.log('');
    // Create Staff
   await Staff.insertMany([
    { name: 'Dr. Priya Mehta', role: 'doctor', department: 'Cardiology', phone: '9876543210', email: 'priya@jeevixa.com', shiftStart: '08:00', shiftEnd: '20:00', hoursOnDuty: 6, isOnDuty: true, fatigueAlert: false, specialization: 'Cardiologist' },
    { name: 'Dr. Rahul Singh', role: 'doctor', department: 'Neurology', phone: '9876543211', email: 'rahul@jeevixa.com', shiftStart: '08:00', shiftEnd: '20:00', hoursOnDuty: 8, isOnDuty: true, fatigueAlert: false, specialization: 'Neurologist' },
    { name: 'Dr. Anjali Rao', role: 'doctor', department: 'Pediatrics', phone: '9876543212', email: 'anjali@jeevixa.com', shiftStart: '09:00', shiftEnd: '21:00', hoursOnDuty: 5, isOnDuty: true, fatigueAlert: false, specialization: 'Pediatrician' },
    { name: 'Dr. Vikram Patel', role: 'doctor', department: 'Orthopedics', phone: '9876543213', email: 'vikram@jeevixa.com', shiftStart: '06:00', shiftEnd: '18:00', hoursOnDuty: 10, isOnDuty: true, fatigueAlert: true, specialization: 'Orthopedic Surgeon' },
    { name: 'Dr. Sneha Gupta', role: 'doctor', department: 'Oncology', phone: '9876543214', email: 'sneha@jeevixa.com', shiftStart: '10:00', shiftEnd: '22:00', hoursOnDuty: 4, isOnDuty: true, fatigueAlert: false, specialization: 'Oncologist' },
    { name: 'Nurse Kavita Sharma', role: 'nurse', department: 'ICU', phone: '9876543215', email: 'kavita@jeevixa.com', shiftStart: '12:00', shiftEnd: '00:00', hoursOnDuty: 7, isOnDuty: true, fatigueAlert: false, specialization: '' },
    { name: 'Nurse Amit Kumar', role: 'nurse', department: 'Emergency', phone: '9876543216', email: 'amit@jeevixa.com', shiftStart: '00:00', shiftEnd: '12:00', hoursOnDuty: 11, isOnDuty: true, fatigueAlert: true, specialization: '' },
    { name: 'Nurse Pooja Verma', role: 'nurse', department: 'General Ward A', phone: '9876543217', email: 'pooja@jeevixa.com', shiftStart: '08:00', shiftEnd: '20:00', hoursOnDuty: 6, isOnDuty: true, fatigueAlert: false, specialization: '' },
    { name: 'Dr. Arjun Nair', role: 'doctor', department: 'Psychiatry', phone: '9876543218', email: 'arjun@jeevixa.com', shiftStart: '09:00', shiftEnd: '17:00', hoursOnDuty: 3, isOnDuty: false, fatigueAlert: false, specialization: 'Psychiatrist' },
    { name: 'Nurse Ritu Joshi', role: 'nurse', department: 'Maternity', phone: '9876543219', email: 'ritu@jeevixa.com', shiftStart: '20:00', shiftEnd: '08:00', hoursOnDuty: 2, isOnDuty: true, fatigueAlert: false, specialization: '' },
  ]);
  console.log('👨‍⚕️ Staff created');

// Create Alerts
  await Alert.insertMany([
    { type: 'critical', category: 'bed', message: 'ICU C3 bed occupancy at 94% — immediate action required', ward: 'ICU', isRead: false, isResolved: false },
    { type: 'warning', category: 'energy', message: 'Block B energy consumption 18% above threshold — HVAC throttle recommended', ward: 'General Ward B', isRead: false, isResolved: false },
    { type: 'warning', category: 'supply', message: 'Surgical Gloves (Size M) below reorder point — auto order initiated', ward: 'General Ward A', isRead: false, isResolved: false },
    { type: 'critical', category: 'infection', message: 'MRSA detected in ICU C3 — isolation protocol activated', ward: 'ICU', isRead: false, isResolved: false },
    { type: 'info', category: 'system', message: 'UV-C disinfection cycle complete in Ward F1 — cleared for admission', ward: 'General Ward A', isRead: true, isResolved: true },
    { type: 'warning', category: 'staff', message: 'Dr. Vikram Patel on duty for 10+ hours — fatigue risk high', ward: 'Orthopedics', isRead: false, isResolved: false },
    { type: 'critical', category: 'patient', message: 'Emergency Dept H1 wait time exceeding 45 mins — triage protocol activated', ward: 'Emergency', isRead: false, isResolved: false },
    { type: 'info', category: 'system', message: 'Solar array output 142 kWh — grid dependency reduced by 6%', ward: 'General', isRead: true, isResolved: true },
  ]);
  console.log('🔔 Alerts created');

// Create Patients
  await Patient.insertMany([
    { name: 'Rajesh Kumar', age: 52, gender: 'male', phone: '9811234567', address: 'Delhi', condition: 'Cardiac Arrest', severity: 'critical', department: 'Cardiology', assignedBed: 'CAR-01', assignedWard: 'Cardiology', bloodGroup: 'O+', allergies: ['Penicillin'], attendingDoctor: 'Dr. Priya Mehta', status: 'critical' },
    { name: 'Sunita Devi', age: 34, gender: 'female', phone: '9822345678', address: 'Noida', condition: 'Pregnancy Complications', severity: 'high', department: 'Maternity', assignedBed: 'MAT-02', assignedWard: 'Maternity', bloodGroup: 'B+', allergies: [], attendingDoctor: 'Dr. Anjali Rao', status: 'admitted' },
    { name: 'Amit Sharma', age: 28, gender: 'male', phone: '9833456789', address: 'Gurgaon', condition: 'Fracture — Left Femur', severity: 'medium', department: 'Orthopedics', assignedBed: 'ORT-03', assignedWard: 'Orthopedics', bloodGroup: 'A+', allergies: [], attendingDoctor: 'Dr. Vikram Patel', status: 'admitted' },
    { name: 'Priya Singh', age: 45, gender: 'female', phone: '9844567890', address: 'Faridabad', condition: 'Brain Tumor', severity: 'high', department: 'Neurology', assignedBed: 'NEU-01', assignedWard: 'Neurology', bloodGroup: 'AB+', allergies: ['Aspirin'], attendingDoctor: 'Dr. Rahul Singh', status: 'admitted' },
    { name: 'Mohammed Ali', age: 61, gender: 'male', phone: '9855678901', address: 'Delhi', condition: 'Kidney Failure', severity: 'critical', department: 'Nephrology', assignedBed: 'NEP-01', assignedWard: 'Nephrology', bloodGroup: 'O-', allergies: [], attendingDoctor: 'Dr. Sneha Gupta', status: 'critical' },
    { name: 'Kavya Reddy', age: 8, gender: 'female', phone: '9866789012', address: 'Ghaziabad', condition: 'High Fever', severity: 'medium', department: 'Pediatrics', assignedBed: 'PED-01', assignedWard: 'Pediatrics', bloodGroup: 'B-', allergies: [], attendingDoctor: 'Dr. Anjali Rao', status: 'under observation' },
    { name: 'Suresh Yadav', age: 55, gender: 'male', phone: '9877890123', address: 'Delhi', condition: 'Cancer Treatment', severity: 'high', department: 'Oncology', assignedBed: 'ONO-02', assignedWard: 'Oncology', bloodGroup: 'A-', allergies: ['Morphine'], attendingDoctor: 'Dr. Sneha Gupta', status: 'admitted' },
  ]);
    console.log('🏥 Patients created');
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();