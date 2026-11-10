const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  patientName: { type: String, default: "" },
  patientId: { type: String, default: "" },
  note: { type: String, default: "" },
  comment: { type: String, default: "" },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    index: true,
  },});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
