const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    codeProduit: {
      type: String,
      required: true,
      unique: true,
    },
    libelleProduit: {
      type: String,
      required: true,
      trim: true,
    },
    prix: {
      type: Number, // `double` n'existe pas en Mongoose, `Number` couvre les décimaux
      required: true,
      min: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const Produit = mongoose.model("Produit", produitSchema);
module.exports = Produit;
