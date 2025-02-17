const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema(
  {
    modePaiement: {
      type: String,
      required: true,
      enum: ["Carte bancaire", "Virement", "Chèque", "Espèces"]
    },
    statut: {
      type: String,
      required: true,
      enum: ["En attente", "Validé", "Échoué"]
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    montant: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

const Paiement = mongoose.model("Paiement", paiementSchema);
module.exports = Paiement;
