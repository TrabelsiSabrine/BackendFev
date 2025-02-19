const reclamationModel = require("../models/reclamationSchema");

// ➤ Ajouter une réclamation
module.exports.addReclamation = async (req, res) => {
  try {
    const { description, status, date } = req.body;

    const newReclamation = new reclamationModel({
      description,
      status: status || "En attente", // Valeur par défaut
      date: date || new Date(), // Si aucune date fournie, prend la date actuelle
    });

    await newReclamation.save();
    res.status(201).json({ message: "Réclamation ajoutée avec succès", reclamation: newReclamation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➤ Récupérer toutes les réclamations
module.exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await reclamationModel.find();
    res.status(200).json({ reclamations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➤ Récupérer une réclamation par ID
module.exports.getReclamationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamation = await reclamationModel.findById(id);

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    res.status(200).json({ reclamation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➤ Mettre à jour une réclamation par ID
module.exports.updateReclamationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status, date } = req.body;

    const updatedReclamation = await reclamationModel.findByIdAndUpdate(
      id,
      { description, status, date },
      { new: true }
    );

    if (!updatedReclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    res.status(200).json({ message: "Réclamation mise à jour", reclamation: updatedReclamation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➤ Supprimer une réclamation par ID
module.exports.deleteReclamationById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReclamation = await reclamationModel.findByIdAndDelete(id);

    if (!deletedReclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    res.status(200).json({ message: "Réclamation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
