const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    role: String,
    produits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Produit" }] // Un utilisateur peut avoir plusieurs produits
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
