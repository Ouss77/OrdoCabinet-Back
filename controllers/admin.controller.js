const bcrypt = require("bcryptjs");
const Admin = require("../models/AdminModel");

const publicUser = (user) => {
  const safe = user.toObject();
  delete safe.password;
  return safe;
};

const health = (req, res) => {
  res.json({ message: "hello world" });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed. User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed. Wrong password." });
    }

    res.status(200).json({ message: "Login successful", ...publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new Admin({ username, password: hashedPassword }).save();
    res.status(201).json(publicUser(user));
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, fullName, cabinetName, specialty, phone, email, city, address, plan } = req.body;
    if (!username || !password || !fullName || !cabinetName) {
      return res.status(400).json({ message: "Nom, cabinet, identifiant et mot de passe sont requis." });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Cet identifiant est déjà utilisé." });
    }

    const user = await new Admin({
      username,
      password: await bcrypt.hash(password, 10),
      fullName,
      cabinetName,
      specialty: specialty || "",
      phone: phone || "",
      email: email || "",
      city: city || "",
      address: address || "",
      plan: plan || "Cabinet",
    }).save();
    res.status(201).json({ message: "Compte créé", ...publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Identifiant requis." });
    }

    const allowed = ["fullName", "specialty", "cabinetName", "phone", "email", "city", "address", "plan"];
    const patch = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    });

    const user = await Admin.findOneAndUpdate({ username }, patch, { new: true });
    if (!user) {
      return res.status(404).json({ message: "Cabinet introuvable." });
    }
    res.status(200).json({ message: "Profil mis à jour", ...publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { health, login, addUser, register, updateProfile };
