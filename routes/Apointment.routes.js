
const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
  createAppointment,
  listAppointmentsByDate,
  deleteAppointment,
} = require("../controllers/appointment.controller");

const router = express.Router();
router.use(requireAuth);

router.post("/appointments", createAppointment);
router.get("/appointments/:date", listAppointmentsByDate);
router.delete("/appointments/:id", deleteAppointment);

module.exports = router;
