const express = require("express");
const { listVisits, addVisit, removeVisit, updateMotif } = require("../controllers/visit.controller");

const router = express.Router();

router.get("/visits", listVisits);
router.post("/addVisit", addVisit);
router.delete("/removeVisit", removeVisit);
router.patch("/updateMotif", updateMotif);

module.exports = router;
