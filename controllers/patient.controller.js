const Patient = require("../models/UserModel");
const { ownerOf, cabinetFilter, belongsToCabinet } = require("../utils/cabinet");

const formatDate = (value) => (value ? value.toISOString().split("T")[0] : null);

const createPatient = async (req, res) => {
  try {
    const newPatient = new Patient({
      nom: req.body.nom,
      prenom: req.body.prenom,
      dateNaissance: req.body.dateNaissance,
      adresse: req.body.adresse,
      tel: req.body.tel,
      CIN: req.body.CIN,
      doctorUsername: ownerOf(req),
    });
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const listPatients = async (req, res) => {
  try {
    const users = await Patient.find(cabinetFilter(req));
    const formattedUsers = users.map((user) => ({
      ...user._doc,
      dateVisite: formatDate(user.dateVisite),
      dateNaissance: formatDate(user.dateNaissance),
    }));
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Could not fetch users" });
  }
};

const getPatientCin = async (req, res) => {
  try {
    const { nom, prenom } = req.query;
    if (!nom || !prenom) {
      return res.status(400).json({ message: "Nom and prenom are required" });
    }

    const patient = await Patient.findOne(cabinetFilter(req, { nom, prenom }), "CIN");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ cin: patient.CIN });
  } catch (error) {
    console.error("Error retrieving patient CIN:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPatientId = async (req, res) => {
  try {
    const { nom, prenom } = req.query;
    if (!nom || !prenom) {
      return res.status(400).json({ message: "Nom and prenom are required" });
    }

    const patient = await Patient.findOne(cabinetFilter(req, { nom, prenom }), "_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ id: patient._id });
  } catch (error) {
    console.error("Error retrieving patient ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMedicalInfo = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId, "medicalInfos doctorUsername");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    if (!belongsToCabinet(req, patient)) {
      return res.status(403).json({ message: "Ce dossier appartient à un autre cabinet." });
    }

    res.json(patient.medicalInfos);
  } catch (error) {
    console.error("Error retrieving medical info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    if (!belongsToCabinet(req, patient)) {
      return res.status(403).json({ message: "Ce dossier appartient à un autre cabinet." });
    }
    await patient.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Could not delete user" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const existing = await Patient.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Patient not found" });
    }
    if (!belongsToCabinet(req, existing)) {
      return res.status(403).json({ message: "Ce dossier appartient à un autre cabinet." });
    }

    const updates = { ...req.body };
    delete updates.doctorUsername;
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addMedicalInfo = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    if (!belongsToCabinet(req, patient)) {
      return res.status(403).json({ message: "Ce dossier appartient à un autre cabinet." });
    }

    const newInfo = {
      id: patient.nextMedicalId,
      mutuelle: req.body.mutuelle,
      motif: req.body.motif,
      tension: req.body.tension,
      diagnostic: req.body.diagnostic,
      traitement: req.body.traitement,
      dateVisite: req.body.dateVisite,
    };
    patient.medicalInfos.push(newInfo);
    patient.nextMedicalId += 1;

    const updatedPatient = await patient.save();
    res.status(201).json(updatedPatient);
  } catch (error) {
    console.error("Error adding medical info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPatient,
  listPatients,
  getPatientCin,
  getPatientId,
  getMedicalInfo,
  deletePatient,
  updatePatient,
  addMedicalInfo,
};
