const express = require("express");
const { listVisits, addVisit, removeVisit, updateMotif } = require("../controllers/visit.controller");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);
router.get("/visits", listVisits);
router.post("/addVisit", addVisit);
router.delete("/removeVisit", removeVisit);
router.patch("/updateMotif", updateMotif);

module.exports = router;
