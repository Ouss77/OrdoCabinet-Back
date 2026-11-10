const express = require("express");
const requireAuth = require("../middleware/requireAuth");
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
router.use(requireAuth);

router.post("/", createPatient);
router.get("/", listPatients);
router.get("/getPatienCIN", getPatientCin);
router.get("/getPatientId", getPatientId);
router.get("/medicalInfo/:patientId", getMedicalInfo);
router.delete("/:id", deletePatient);
router.put("/:id", updatePatient);
router.post("/addMedicalInfo/:id", addMedicalInfo);

module.exports = router;
