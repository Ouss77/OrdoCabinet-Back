const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  patientName: { type: String, default: "" },
  patientId: { type: String, default: "" },
  note: { type: String, default: "" },
  comment: { type: String, default: "" },
  doctorUsername: { type: String, default: "", index: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
