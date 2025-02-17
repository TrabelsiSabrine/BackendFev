const Paiement = require("../models/paiementSchema");

// Récupérer tous les paiements
module.exports.getAllPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find();
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un paiement par ID
module.exports.getPaiementById = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }
    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un paiement
module.exports.addPaiement = async (req, res) => {
  try {
    const { modePaiement, statut, date, montant } = req.body;

    if (!modePaiement || !statut || !montant) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const paiement = new Paiement({ modePaiement, statut, date, montant });
    await paiement.save();
    res.status(201).json(paiement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un paiement
module.exports.updatePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!paiement) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }

    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un paiement
module.exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndDelete(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }
    res.status(200).json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
