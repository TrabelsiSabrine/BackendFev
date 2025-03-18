const Produit = require("../models/produitSchema");

const generateUniqueId = async () => {
  const lastProduit = await Produit.findOne().sort({ id: -1 });
  return lastProduit ? lastProduit.id + 1 : 1;
};

module.exports = {
  // Ajouter un produit
  addProduit: async (req, res) => {
    try {
      const { codeProduit, libelleProduit, prix } = req.body;

      if (!codeProduit || !libelleProduit || !prix) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const id = await generateUniqueId();

      const newProduit = new Produit({ id, codeProduit, libelleProduit, prix });

      await newProduit.save();
      res.status(201).json({ message: "Produit ajouté avec succès", produit: newProduit });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer un produit par ID
  getProduitById: async (req, res) => {
    try {
      const { id } = req.params;
      const produit = await Produit.findOne({ id });

      if (!produit) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      res.status(200).json(produit);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Mettre à jour un produit
  updateProduit: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProduit = await Produit.findOneAndUpdate({ id }, req.body, { new: true });

      if (!updatedProduit) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      res.status(200).json({ message: "Produit mis à jour avec succès", produit: updatedProduit });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Supprimer un produit par ID
  deleteProduitById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduit = await Produit.findOneAndDelete({ id });

      if (!deletedProduit) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },

  // Récupérer les produits par libellé
  getProduitsByLibelle: async (req, res) => {
    try {
      const { libelleProduit } = req.params;
      const produits = await Produit.find({ libelleProduit: new RegExp(libelleProduit, "i") });

      if (produits.length === 0) {
        return res.status(404).json({ message: "Aucun produit trouvé avec ce libellé" });
      }

      res.status(200).json(produits);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};
