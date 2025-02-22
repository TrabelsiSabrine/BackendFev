const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    nom: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tarif: {
      type: Number,
      required: [true, "Le tarif est obligatoire"],
      min: [0, "Le tarif ne peut pas être négatif"],
    },
    typeProduit: {
      type: String,
      enum: ["Assurance Habitation", "Assurance Voyage", "Assurance Auto", "Assurance Santé"],
      required: [true, "Le type du produit est obligatoire"],
    },
    duree: {
      type: String,
      required: [true, "La durée est obligatoire"],
      min: [1, "La durée doit être d'au moins 1 mois"],
    },
    garanties: {
      type: [String],
      default: [],
    },
    conditionsGenerales: {
      type: String,
      required: [true, "Les conditions générales sont obligatoires"],
    },
    statut: {
      type: String,
      enum: ["actif", "expiré", "annulé"],
      default: "actif",
    },
    contrats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClientContrat' }] // Liens avec les contrats associés

  },
  { timestamps: true, versionKey: false }
);

const Produit = mongoose.model("Produit", produitSchema);
module.exports = Produit;
