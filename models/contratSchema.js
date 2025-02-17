const mongoose = require("mongoose");
const contratSchema = new mongoose.Schema(
  {
    numeroDeContrat: String,
    dateDebut: Date,
    dateFin: Date,
    statut: String,
    montant: Number,
},
  { timestamps: true }
);

const Contrat = mongoose.model("Contrat", contratSchema);
module.exports = Contrat;