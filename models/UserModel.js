const mongoose = require('mongoose');

const medicalInfoSchema = new mongoose.Schema({
  id: Number,  // Add this field to act as a manual incrementer
  tension: String,
  motif: String,
  diagnostic: String,
  traitement: String,
  mutuelle: String,
  dateVisite: { type: Date, default: Date.now }
}, { _id: false });  // Continue to disable the automatic _id generation


const patientSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: Date,
  adresse: String,
  tel: String,
  CIN: String,
  doctorUsername: { type: String, default: "", index: true },
  medicalInfos: [medicalInfoSchema], 
  nextMedicalId: { type: Number, default: 1 }  // New field to track the next ID
});

const Patient = mongoose.model('Patients', patientSchema);

module.exports = Patient;
