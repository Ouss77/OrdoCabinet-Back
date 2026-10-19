const Visit = require("../models/VisitModel");
const { ownerOf, cabinetFilter, belongsToCabinet } = require("../utils/cabinet");

const listVisits = async (req, res) => {
  try {
    const visits = await Visit.find(cabinetFilter(req));
    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addVisit = async (req, res) => {
  const { nom, prenom, motif, patientId } = req.body;
  try {
    const newVisit = new Visit({
      nom,
      prenom,
      patientId,
      motif,
      doctorUsername: ownerOf(req),
      dateVisited: new Date(),
    });
    await newVisit.save();
    res.status(201).send(newVisit);
  } catch (error) {
    res.status(500).json({ message: "Error saving visit", error });
  }
};

const removeVisit = async (req, res) => {
  const { nom, prenom } = req.query;
  try {
    const visit = await Visit.findOneAndDelete(cabinetFilter(req, { nom, prenom }));
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }
    res.json({ message: "Visit removed successfully" });
  } catch (error) {
    console.error("Failed to remove visit", error);
    res.status(500).json({ message: "Failed to remove visit" });
  }
};

const updateMotif = async (req, res) => {
  const { id, motif } = req.body;
  try {
    const visit = await Visit.findById(id);
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }
    if (!belongsToCabinet(req, visit)) {
      return res.status(403).json({ message: "Cette visite appartient à un autre cabinet." });
    }
    visit.motif = motif;
    await visit.save();
    res.json({ message: "Motif updated successfully" });
  } catch (error) {
    console.error("Failed to update motif", error);
    res.status(500).json({ message: "Failed to update motif" });
  }
};

module.exports = { listVisits, addVisit, removeVisit, updateMotif };
