const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    patientId: String,
    motif: String,
    doctorUsername: { type: String, default: "", index: true },
    dateVisited: { type: Date, default: Date.now }
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;