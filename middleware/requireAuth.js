const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = require("../models/AdminModel");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({
        message: "Authentification requise.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    if (
      typeof decoded.userId !== "string" ||
      !mongoose.isValidObjectId(decoded.userId)
    ) {
      return res.status(401).json({
        message: "Session invalide.",
      });
    }

    const user = await Admin.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Compte introuvable ou supprimé.",
      });
    }

    req.user = {
      id: user._id.toString(),
    };

    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session invalide ou expirée.",
      });
    }

    return res.status(500).json({
      message: "Erreur de vérification de la session.",
    });
  }
};

module.exports = requireAuth;