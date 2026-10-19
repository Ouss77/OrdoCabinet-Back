// models/medicament.model.js
const mongoose = require('mongoose');

const medicamentSchema = new mongoose.Schema({
    CODE: {
        type: String,
        required: true,
        unique: true,
    },
    NOM: {
        type: String,
        required: true,
    },
    DCI1: {
        type: String,
        required: true,
    },
    DOSAGE1: {
        type: Number,
        required: true,
    },
    FORME: {
        type: String,
        required: true,
    },
    PRESENTATION: {
        type: String,
        required: true,
    },
    PRIX_BR: {
        type: Number,
        required: true,
    },
});

const Medicament = mongoose.model('Medicament', medicamentSchema);

module.exports = Medicament;
