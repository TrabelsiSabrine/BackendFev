// controllers/client_contratController.js
const Contrat = require('../models/client_contratScheme');

// Créer un contrat
exports.createContrat = async (req, res) => {
  try {
    const contrat = new Contrat({
      id: req.body.id,
      numeroDeContrat: req.body.numeroDeContrat,
      prix: req.body.prix,
      modePaiement: req.body.modePaiement,
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
      dateSignature: req.body.dateSignature,
      statut: req.body.statut,
    });

    await contrat.save();
    res.status(201).json({ message: 'Contrat créé avec succès', contrat });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du contrat', error });
  }
};

// Récupérer tous les contrats
exports.getAllContrats = async (req, res) => {
  try {
    const contrats = await Contrat.find();
    res.status(200).json(contrats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des contrats', error });
  }
};
