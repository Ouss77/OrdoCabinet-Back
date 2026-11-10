const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    patientId: String,
    motif: String,
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
        index: true,
      },    dateVisited: { type: Date, default: Date.now }
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;