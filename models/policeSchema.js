const mongoose = require("mongoose");

const policeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    numpolice: {
      type: String,
      required: [true, "Le numéro de police est requis"],
      unique: true,
    },
    dateEffet: {
      type: Date,
      required: [true, "La date d'effet est requise"],
    },
    dateFinEffet: {
      type: Date,
      required: [true, "La date de fin d'effet est requise"],
    },
    statutPaiement: {
      type: String,
      required: [true, "Le statut de paiement est requis"],
      enum: ["payé", "non payé", "en attente"],  // Enum pour limiter les valeurs possibles
      default: "en attente",
    },
  },
  { timestamps: true, versionKey: false }
);

const Police = mongoose.model("Police", policeSchema);
module.exports = Police;
