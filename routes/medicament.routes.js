const express = require("express");
const { listMedicaments } = require("../controllers/medicament.controller");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/medicaments", requireAuth, listMedicaments);

module.exports = router;