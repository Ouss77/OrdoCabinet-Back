const express = require("express");
const {
  createAppointment,
  listAppointmentsByDate,
  deleteAppointment,
} = require("../controllers/appointment.controller");

const router = express.Router();

router.post("/appointments", createAppointment);
router.get("/appointments/:date", listAppointmentsByDate);
router.delete("/appointments/:id", deleteAppointment);

module.exports = router;
