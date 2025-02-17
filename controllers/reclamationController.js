const Reclamation = require("../models/reclamationSchema");

// Récupérer toutes les réclamations
module.exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find();
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une réclamation par ID
module.exports.getReclamationById = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation introuvable" });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter une réclamation
module.exports.addReclamation = async (req, res) => {
  try {
    const { description, statut, date } = req.body;

    if (!description) {
      return res.status(400).json({ message: "La description est requise" });
    }

    const reclamation = new Reclamation({ description, statut, date });
    await reclamation.save();
    res.status(201).json(reclamation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une réclamation
module.exports.updateReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation introuvable" });
    }

    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une réclamation
module.exports.deleteReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findByIdAndDelete(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation introuvable" });
    }
    res.status(200).json({ message: "Réclamation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
