const Appointment = require("../models/Apointment.model");
const { ownerOf, cabinetFilter, belongsToCabinet } = require("../utils/cabinet");

const normalizeTime = (time) => {
  const match = String(time || "").trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "";
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return "";
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const createAppointment = async (req, res) => {
  try {
    const date = String(req.body.date || "").trim();
    const time = normalizeTime(req.body.time);
    const patientName = String(req.body.patientName || req.body.note || "").trim();
    const patientId = String(req.body.patientId || "").trim();
    const comment = String(req.body.comment || "").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !time || !patientName) {
      return res.status(400).json({ message: "Date, heure et patient sont requis." });
    }

    const existing = await Appointment.find(cabinetFilter(req, { date }));
    const taken = existing.some((item) => normalizeTime(item.time) === time);
    if (taken) {
      return res.status(409).json({ message: "Ce créneau est déjà réservé." });
    }

    const saved = await new Appointment({
      date,
      time,
      patientName,
      patientId,
      note: patientName,
      comment,
      doctorUsername: ownerOf(req),
    }).save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Impossible d'enregistrer le rendez-vous." });
  }
};

const listAppointmentsByDate = async (req, res) => {
  try {
    const appointments = await Appointment.find(cabinetFilter(req, { date: req.params.date }));
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Impossible de charger l'agenda." });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous introuvable." });
    }
    if (!belongsToCabinet(req, appointment)) {
      return res.status(403).json({ message: "Ce rendez-vous appartient à un autre cabinet." });
    }
    await appointment.deleteOne();
    res.json({ message: "Créneau libéré." });
  } catch (error) {
    res.status(500).json({ message: "Impossible de libérer le créneau." });
  }
};

module.exports = { createAppointment, listAppointmentsByDate, deleteAppointment };
