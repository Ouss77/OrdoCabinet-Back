const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { clientOrigin } = require("./config/env");

const userRoutes = require("./routes/UserRoutes");
const visitRoutes = require("./routes/VisitRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const appointmentRoutes = require("./routes/Apointment.routes");
const medicamentRoutes = require("./routes/medicament.routes");

const app = express();

app.use(helmet());
app.use(cors({
  origin: clientOrigin,
  allowedHeaders: ["Content-Type", "x-cabinet-user"],
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
