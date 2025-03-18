const mongoose = require("mongoose");

const reclamationSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
    },
    statut: {
      type: String,
      enum: ["En attente", "En cours", "Résolue", "Rejetée"],
      default: "En attente",
    },
    dateSoumission: {
      type: Date,
      default: Date.now,
    },
    dateTraitement: {
      type: Date,
    },
    reponseAdmin: {
      type: String,
      trim: true,
      default: "",
    },
    adherent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adherent",
      required: [true, "L'adhérent associé est obligatoire"],
    },
  },
  { timestamps: true, versionKey: false }
);

const Reclamation = mongoose.model("Reclamation", reclamationSchema);
module.exports = Reclamation;
