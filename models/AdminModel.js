const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: { type: String, default: "" },
  specialty: { type: String, default: "" },
  cabinetName: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  plan: { type: String, default: "Cabinet" },
});


const Admin = mongoose.model("Admin", UserSchema);

module.exports = Admin;
