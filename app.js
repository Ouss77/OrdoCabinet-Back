const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { clientOrigin } = require("./config/env");

const userRoutes = require("./routes/UserRoutes");
const visitRoutes = require("./routes/VisitRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const appointmentRoutes = require("./routes/Apointment.routes");
const medicamentRoutes = require("./routes/medicament.routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(cors({
  origin: clientOrigin,
  credentials: true,
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api", visitRoutes);
app.use(medicamentRoutes);
app.use(adminRoutes);
app.use(appointmentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
