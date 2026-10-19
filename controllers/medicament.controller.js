const Medicament = require("../models/medicament.model");

const listMedicaments = async (req, res) => {
  try {
    const medicaments = await Medicament.find({});
    res.status(200).json(medicaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listMedicaments };
