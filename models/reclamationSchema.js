const mongoose = require("mongoose");

const reclamationSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    statut: { type: String, enum: ["En attente", "Traitée", "Rejetée"], default: "En attente" },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Reclamation = mongoose.model("Reclamation", reclamationSchema);
module.exports = Reclamation;
