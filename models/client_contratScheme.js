// models/client_contratScheme.js
const mongoose = require('mongoose');

const contratSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  numeroDeContrat: {
    type: String,
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  modePaiement: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  dateSignature: {
    type: Date,
    required: true,
  },
  statut: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Contrat', contratSchema);
