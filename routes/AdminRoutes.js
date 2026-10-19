const express = require("express");
const { health, login, addUser, register, updateProfile } = require("../controllers/admin.controller");

const router = express.Router();

router.get("/", health);
router.post("/login", login);
router.post("/adduser", addUser);
router.post("/register", register);
router.put("/profile", updateProfile);

module.exports = router;
