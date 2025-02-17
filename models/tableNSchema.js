const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    role: String,
    contrats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contrat" }] // Un utilisateur peut avoir plusieurs contrats
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
