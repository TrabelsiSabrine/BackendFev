const mongoose = require('mongoose');

const clientContratSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Référence au client
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },  // Référence au produit/contrat
  numeroDeContrat: { type: String, required: true },
  prix: { type: Number, required: true },
  modePaiement: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  dateSignature: { type: Date, required: true },
  statut: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ClientContrat', clientContratSchema);
