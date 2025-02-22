const userModel = require("../models/userSchema");
const reclamationModel = require("../models/reclamationSchema");

module.exports.addReclamation = async (req, res) => {
  try {
    const { description, status, date, userId } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Créer la réclamation
    const newReclamation = new reclamationModel({
      description,
      status: status || "En attente",
      date: date || new Date(),
      user: userId,
    });

    await newReclamation.save();

    // Ajouter la réclamation à l'utilisateur
    await userModel.findByIdAndUpdate(userId, {
      $push: { reclamations: newReclamation._id },
    });

    return res.status(201).json({
      message: "Réclamation ajoutée avec succès",
      reclamation: newReclamation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await reclamationModel.find().populate("user"); 
    return res.status(200).json({ reclamations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getReclamationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamation = await reclamationModel.findById(id).populate("user");

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    return res.status(200).json({ reclamation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

    return res.status(200).json({
      message: "Réclamation mise à jour",
      reclamation: updatedReclamation,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports.getReclamationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate("reclamations");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json({ reclamations: user.reclamations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteReclamationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reclamation = await reclamationModel.findById(id);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    // Vérifier si l'utilisateur a bien créé cette réclamation (facultatif si pas nécessaire)
    if (req.body.userId && reclamation.user.toString() !== req.body.userId) {
      return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer cette réclamation" });
    }

    // Supprimer la réclamation
    await reclamationModel.findByIdAndDelete(id);

    // Retirer la réclamation du tableau des réclamations de l'utilisateur
    await userModel.findByIdAndUpdate(reclamation.user, {
      $pull: { reclamations: id },
    });

    return res.status(200).json({
      message: "Réclamation supprimée avec succès",
      deletedReclamation: reclamation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Affecter une réclamation à un utilisateur
module.exports.affectReclamation = async (req, res) => {
  try {
    const { userId, reclamationId } = req.body;

    const reclamation = await reclamationModel.findById(reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation introuvable" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Mettre à jour la réclamation avec le nouvel utilisateur
    await reclamationModel.findByIdAndUpdate(reclamationId, {
      $set: { user: userId },
    });

    // Ajouter la réclamation à l'utilisateur
    await userModel.findByIdAndUpdate(userId, {
      $push: { reclamations: reclamationId },
    });

    return res.status(200).json({ message: "Réclamation affectée avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Désaffecter une réclamation d'un utilisateur
module.exports.desaffectReclamation = async (req, res) => {
  try {
    const { userId, reclamationId } = req.body;

    const reclamation = await reclamationModel.findById(reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation introuvable" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Supprimer l'association entre la réclamation et l'utilisateur
    await reclamationModel.findByIdAndUpdate(reclamationId, {
      $unset: { user: 1 }, // Supprime l'utilisateur assigné
    });

    // Retirer la réclamation du tableau de l'utilisateur
    await userModel.findByIdAndUpdate(userId, {
      $pull: { reclamations: reclamationId },
    });

    return res.status(200).json({ message: "Réclamation désaffectée avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
