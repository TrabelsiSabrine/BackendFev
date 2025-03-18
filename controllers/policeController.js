const Police = require("../models/policeSchema");

const generateUniqueId = async () => {
  const lastPolice = await Police.findOne().sort({ id: -1 });
  return lastPolice ? lastPolice.id + 1 : 1;
};

module.exports = {
  // Ajouter une police
  addPolice: async (req, res) => {
    try {
      const { numpolice, dateEffet, dateFinEffet, statutPaiement } = req.body;

      if (!numpolice || !dateEffet || !dateFinEffet || !statutPaiement) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const id = await generateUniqueId();

      const newPolice = new Police({
        id,
        numpolice,
        dateEffet,
        dateFinEffet,
        statutPaiement,
      });

      await newPolice.save();
      res.status(201).json({ message: "Police ajoutée avec succès", police: newPolice });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer une police par ID
  getPoliceById: async (req, res) => {
    try {
      const { id } = req.params;
      const police = await Police.findOne({ id });

      if (!police) {
        return res.status(404).json({ message: "Police non trouvée" });
      }

      res.status(200).json(police);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Mettre à jour une police
  updatePolice: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedPolice = await Police.findOneAndUpdate({ id }, req.body, { new: true });

      if (!updatedPolice) {
        return res.status(404).json({ message: "Police non trouvée" });
      }

      res.status(200).json({ message: "Police mise à jour avec succès", police: updatedPolice });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Supprimer une police par ID
  deletePoliceById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPolice = await Police.findOneAndDelete({ id });

      if (!deletedPolice) {
        return res.status(404).json({ message: "Police non trouvée" });
      }

      res.status(200).json({ message: "Police supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};
