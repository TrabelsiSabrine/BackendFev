const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    policeId: {
      type: Number,
      required: [true, "L'ID de la police est requis"],
    },
    montant: {
      type: Number,
      required: [true, "Le montant est requis"],
      min: [0, "Le montant ne peut pas être négatif"],
    },
    numeroTransaction: {
      type: String,
      required: [true, "Le numéro de transaction est requis"],
      unique: true,
    },
    dateEffetconcerne: {
      type: Date,
      required: [true, "La date d'effet est requise"],
    },
    dateFinEffetconcerne: {
      type: Date,
      required: [true, "La date de fin d'effet est requise"],
    },
  },
  { timestamps: true, versionKey: false }
);

const Paiement = mongoose.model("Paiement", paiementSchema);
module.exports = Paiement;
