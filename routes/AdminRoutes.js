const express = require("express");
const {
    health,
    login,
    register,
    updateProfile,
  } = require("../controllers/admin.controller");const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", health);
router.post("/login", login);
router.post("/register", register);
router.put("/profile", requireAuth, updateProfile);

module.exports = router;
