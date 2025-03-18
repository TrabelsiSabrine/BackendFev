const Paiement = require("../models/paiementSchema");

const generateUniqueId = async () => {
  const lastPaiement = await Paiement.findOne().sort({ id: -1 });
  return lastPaiement ? lastPaiement.id + 1 : 1;
};

module.exports = {
  // Ajouter un paiement
  addPaiement: async (req, res) => {
    try {
      const { policeId, montant, numeroTransaction, dateEffetconcerne, dateFinEffetconcerne } = req.body;

      if (!policeId || !montant || !numeroTransaction || !dateEffetconcerne || !dateFinEffetconcerne) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const id = await generateUniqueId();

      const newPaiement = new Paiement({
        id,
        policeId,
        montant,
        numeroTransaction,
        dateEffetconcerne,
        dateFinEffetconcerne,
      });

      await newPaiement.save();
      res.status(201).json({ message: "Paiement ajouté avec succès", paiement: newPaiement });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer un paiement par ID
  getPaiementById: async (req, res) => {
    try {
      const { id } = req.params;
      const paiement = await Paiement.findOne({ id });

      if (!paiement) {
        return res.status(404).json({ message: "Paiement non trouvé" });
      }

      res.status(200).json(paiement);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Mettre à jour un paiement
  updatePaiement: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedPaiement = await Paiement.findOneAndUpdate({ id }, req.body, { new: true });

      if (!updatedPaiement) {
        return res.status(404).json({ message: "Paiement non trouvé" });
      }

      res.status(200).json({ message: "Paiement mis à jour avec succès", paiement: updatedPaiement });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Supprimer un paiement par ID
  deletePaiementById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPaiement = await Paiement.findOneAndDelete({ id });

      if (!deletedPaiement) {
        return res.status(404).json({ message: "Paiement non trouvé" });
      }

      res.status(200).json({ message: "Paiement supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};
