const express = require("express");
const { listMedicaments } = require("../controllers/medicament.controller");

const router = express.Router();

router.get("/medicaments", listMedicaments);

module.exports = router;
