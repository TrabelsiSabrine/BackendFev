const Produit = require("../models/produitSchema");

const generateUniqueId = async () => {
  const lastProduit = await Produit.findOne().sort({ id: -1 });
  return lastProduit ? lastProduit.id + 1 : 1;
};

module.exports.addProduit = async (req, res) => {
  try {
    const { nom, description, tarif, typeProduit, duree, garanties, conditionsGenerales } = req.body;
    const id = await generateUniqueId();

    const newProduit = new Produit({
      id,
      nom,
      description,
      tarif,
      typeProduit,
      duree,
      garanties,
      conditionsGenerales,
    });

    await newProduit.save();
    res.status(201).json({ message: "Contrat d'assurance ajouté avec succès", produit: newProduit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getProduitById = async (req, res) => {
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
};

module.exports.updateProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduit = await Produit.findOneAndUpdate({ id }, req.body, { new: true });

    if (!updatedProduit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json({ message: "Produit mis à jour avec succès", produit: updatedProduit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduit = await Produit.findOneAndDelete({ id });

    if (!deletedProduit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
