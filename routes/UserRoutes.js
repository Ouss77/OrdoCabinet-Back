const express = require("express");
const {
  createPatient,
  listPatients,
  getPatientCin,
  getPatientId,
  getMedicalInfo,
  deletePatient,
  updatePatient,
  addMedicalInfo,
} = require("../controllers/patient.controller");

const router = express.Router();

router.post("/", createPatient);
router.get("/", listPatients);
router.get("/getPatienCIN", getPatientCin);
router.get("/getPatientId", getPatientId);
router.get("/medicalInfo/:patientId", getMedicalInfo);
router.delete("/:id", deletePatient);
router.put("/:id", updatePatient);
router.post("/addMedicalInfo/:id", addMedicalInfo);

module.exports = router;
