const Reclamation = require("../models/reclamationSchema");
const Adherent = require("../models/adherentSchema");

// Ajouter une réclamation
module.exports.addReclamation = async (req, res) => {
  try {
    const { description, adherentId } = req.body;

    // Vérifier si l'adhérent existe
    const adherent = await Adherent.findById(adherentId);
    if (!adherent) {
      return res.status(404).json({ message: "Adhérent non trouvé" });
    }

    // Créer la réclamation
    const newReclamation = new Reclamation({
      description,
      adherent: adherentId,
    });

    await newReclamation.save();

    // Ajouter la réclamation à l'adhérent
    await Adherent.findByIdAndUpdate(adherentId, {
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

// Récupérer toutes les réclamations
module.exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find().populate("adherent");
    return res.status(200).json({ reclamations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Récupérer une réclamation par ID
module.exports.getReclamationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'ID est valide
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de réclamation invalide" });
    }

    const reclamation = await Reclamation.findById(id).populate("adherent");

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    return res.status(200).json({ reclamation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une réclamation
module.exports.updateReclamationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, reponseAdmin } = req.body;

    // Validation des valeurs de statut
    const validStatuts = ["En cours", "Résolue", "Rejetée"];
    if (statut && !validStatuts.includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Vérification de l'ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de réclamation invalide" });
    }

    const updatedReclamation = await Reclamation.findByIdAndUpdate(
      id,
      {
        statut,
        reponseAdmin,
        dateTraitement: statut === "Résolue" || statut === "Rejetée" ? new Date() : undefined,
      },
      { new: true }
    );

    if (!updatedReclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    return res.status(200).json({
      message: "Réclamation mise à jour avec succès",
      reclamation: updatedReclamation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Supprimer une réclamation
module.exports.deleteReclamationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier l'ID de la réclamation
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de réclamation invalide" });
    }

    const reclamation = await Reclamation.findById(id);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    await Reclamation.findByIdAndDelete(id);

    // Supprimer la réclamation de la liste de l'adhérent
    await Adherent.findByIdAndUpdate(reclamation.adherent, {
      $pull: { reclamations: id },
    });

    return res.status(200).json({ message: "Réclamation supprimée avec succès" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Récupérer les réclamations d'un adhérent
module.exports.getReclamationsByAdherent = async (req, res) => {
  try {
    const { adherentId } = req.params;

    // Vérifier l'ID de l'adhérent
    if (!adherentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de l'adhérent invalide" });
    }

    const adherent = await Adherent.findById(adherentId).populate("reclamations");
    if (!adherent) {
      return res.status(404).json({ message: "Adhérent non trouvé" });
    }

    return res.status(200).json({ reclamations: adherent.reclamations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Affecter une réclamation (exemple)
module.exports.affectReclamation = async (req, res) => {
  try {
    const { id, agentId } = req.body; // exemple de données envoyées
    const reclamation = await Reclamation.findById(id);

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    reclamation.agent = agentId; // affecter l'agent à la réclamation
    await reclamation.save();

    return res.status(200).json({
      message: "Réclamation affectée avec succès",
      reclamation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Désaffecter une réclamation (exemple)
module.exports.desaffectReclamation = async (req, res) => {
  try {
    const { id } = req.body;
    const reclamation = await Reclamation.findById(id);

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    reclamation.agent = null; // désaffecter l'agent de la réclamation
    await reclamation.save();

    return res.status(200).json({
      message: "Réclamation désaffectée avec succès",
      reclamation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
