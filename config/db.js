const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const connectDB = () =>
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });

module.exports = connectDB;
