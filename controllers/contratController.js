const contratModel = require("../models/contratSchema");
const userModel = require("../models/userSchema");

module.exports.getAllContrats = async (req, res) => {
  try {
    const contratList = await contratModel.find();

    if (!contratList || contratList.length === 0) {
      throw new Error("Aucun contrat trouvé");
    }

    res.status(200).json(contratList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getContratById = async (req, res) => {
  try {
    const id = req.params.id;
    const contrat = await contratModel.findById(id).populate("owner");

    if (!contrat || contrat.length === 0) {
      throw new Error("contrat introuvable");
    }

    res.status(200).json(contrat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteContratById = async (req, res) => {
  try {
    const id = req.params.id;

    const contratById = await contratModel.findById(id);

    if (!contratById || contratById.length === 0) {
      throw new Error("contrat introuvable");
    }

      
    await contratModel.updateMany({}, {
        $pull: { contrats: id },
      });

    await contratModel.findByIdAndDelete(id);

    res.status(200).json("supprimé avec succès !");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addContrat = async (req, res) => {
  try {
    const { numeroDeContrat, dateDebut, dateFin, statut, montant } = req.body;

    // Vérifie si toutes les données nécessaires sont présentes
    if (!numeroDeContrat || !dateDebut || !dateFin || !statut || !montant) {
      throw new Error("Données manquantes");
    }

    // Vérifie si un contrat avec ce numéro existe déjà
    const existingContrat = await contratModel.findOne({ numeroDeContrat });
    if (existingContrat) {
      throw new Error("Le contrat avec ce numéro existe déjà");
    }

    // Si tout est bon, on crée le contrat
    const contrat = await contratModel.create({
      numeroDeContrat,
      dateDebut,
      dateFin,
      statut,
      montant,
    });

    // Retourne le contrat créé
    res.status(201).json({ contrat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateContrat = async (req, res) => {
  try {
    const id = req.params.id;
    const { numeroDeContrat, dateDebut, dateFin, statut, montant } = req.body;

    const contratById = await contratModel.findById(id);

    if (!contratById) {
      throw new Error("contrat introuvable");
    }

    if (!numeroDeContrat & !dateDebut & !dateFin & !statut & !montant) {
      throw new Error("erreur données");
    }

    await contratModel.findByIdAndUpdate(id, {
      $set: { numeroDeContrat, dateDebut, dateFin, statut, montant },
    });

    const updated = await contratModel.findById(id);

    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.affect = async (req, res) => {
  try {
    const { userId, contratId } = req.body;

    const contratById = await contratModel.findById(contratId);

    if (!contratById) {
      throw new Error("contrat introuvable");
    }
    const checkIfUserExists = await userModel.findById(userId);
    if (!checkIfUserExists) {
      throw new Error("Utilisateur introuvable");
    }

    await contratModel.findByIdAndUpdate(contratId, {
      $set: { owner: userId },
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { contrats: contratId },
    });

    res.status(200).json('affected');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.desaffect = async (req, res) => {
    try {
      const { userId, contratId } = req.body;
  
      const contratById = await contratModel.findById(contratId);
  
      if (!contratById) {
        throw new Error("contrat introuvable");
      }
      const checkIfUserExists = await userModel.findById(userId);
      if (!checkIfUserExists) {
        throw new Error("Utilisateur introuvable");
      }
  
      await contratModel.findByIdAndUpdate(contratId, {
        $unset: { owner: 1 },// null "" 
      });
  
      await userModel.findByIdAndUpdate(userId, {
        $pull: { contrats: contratId },
      });
  
      res.status(200).json('desaffected');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  