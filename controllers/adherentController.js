const Adherent = require("../models/adherentSchema");
const jwt = require("jsonwebtoken");

const maxTime = 24 * 60 * 60; // 24 heures
// const maxTime = 1 * 60; // 1 minute pour tester

const createToken = (id) => {
  return jwt.sign({ id }, "net secret pfe", { expiresIn: maxTime });
};

// Ajouter un nouvel adhérent
module.exports.addAdherent = async (req, res) => {
  try {
    const { username, email, mot_de_passe, age } = req.body;
    const roleAdherent = 'adherent';

    // Vérifier si l'email existe déjà
    const existingAdherent = await Adherent.findOne({ email });
    if (existingAdherent) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const newAdherent = new Adherent({ username, email, mot_de_passe, role: roleAdherent, age });

    await newAdherent.save();
    res.status(201).json({ adherent: newAdherent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un adhérent avec une image
module.exports.addAdherentWithImg = async (req, res) => {
  try {
    const { username, email, mot_de_passe } = req.body;
    const { filename } = req.file;
    const roleAdherent = 'adherent';

    const newAdherent = new Adherent({
      username, email, mot_de_passe, role: roleAdherent, user_image: filename
    });

    await newAdherent.save();
    res.status(201).json({ adherent: newAdherent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les adhérents
module.exports.getAllAdherents = async (req, res) => {
  try {
    const adherentList = await Adherent.find();
    res.status(200).json({ adherentList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un adhérent par ID
module.exports.getAdherentById = async (req, res) => {
  try {
    const { id } = req.params;
    const adherent = await Adherent.findById(id);

    if (!adherent) {
      return res.status(404).json({ message: "Adhérent non trouvé" });
    }

    res.status(200).json({ adherent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un adhérent
module.exports.updateAdherent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const adherent = await Adherent.findById(id);
    if (!adherent) {
      return res.status(404).json({ message: "Adhérent non trouvé" });
    }

    const updatedAdherent = await Adherent.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: "Adhérent mis à jour avec succès", adherent: updatedAdherent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un adhérent par ID
module.exports.deleteAdherentById = async (req, res) => {
  try {
    const { id } = req.params;
    const adherent = await Adherent.findById(id);

    if (!adherent) {
      return res.status(404).json({ message: "Adhérent non trouvé" });
    }

    await Adherent.findByIdAndDelete(id);
    res.status(200).json({ message: "Adhérent supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recherche d'un adhérent par nom ou prénom
module.exports.searchAdherentByNomPrenom = async (req, res) => {
  try {
    const { nomPrenom } = req.query;
    if (!nomPrenom) {
      throw new Error("Veuillez fournir un nom ou prénom pour la recherche.");
    }

    const adherentList = await Adherent.find({
      $or: [
        { username: { $regex: nomPrenom, $options: "i" } },
        // Si vous avez un champ 'prenom', vous pouvez aussi ajouter cette condition
      ],
    });

    if (!adherentList.length) {
      return res.status(404).json({ message: "Aucun adhérent trouvé" });
    }

    const count = adherentList.length;
    res.status(200).json({ adherentList, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les adhérents triés par âge
module.exports.getAllAdherentsSortByAge = async (req, res) => {
  try {
    const adherentList = await Adherent.find().sort({ age: 1 }).limit(2);
    res.status(200).json({ adherentList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les adhérents d'un âge spécifique
module.exports.getAdherentsByAge = async (req, res) => {
  try {
    const { age } = req.params;
    const adherentList = await Adherent.find({ age });

    res.status(200).json({ adherentList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les adhérents entre un âge min et max
module.exports.getAdherentsBetweenAges = async (req, res) => {
  try {
    const { MaxAge, MinAge } = req.query;
    if (!MaxAge || !MinAge) {
      return res.status(400).json({ message: "Veuillez fournir un âge minimum et maximum." });
    }

    const adherentList = await Adherent.find({
      age: { $gt: MinAge, $lt: MaxAge },
    }).sort({ age: 1 });

    res.status(200).json({ adherentList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Authentification et connexion d'un adhérent
module.exports.login = async (req, res) => {
  try {
    const { numeroAdherent, mot_de_passe } = req.body;

    // Vérifier si l'adhérent existe avec ce numéro
    const adherent = await Adherent.findOne({ numeroAdherent });
    if (!adherent) {
      return res.status(400).json({ message: "Numéro d'adhérent incorrect" });
    }

    // Vérifier le mot de passe
    if (adherent.mot_de_passe !== mot_de_passe) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = createToken(adherent._id);
    res.cookie("jwt_token_adherent", token, { httpOnly: false, maxAge: maxTime * 1000 });

    res.status(200).json({ message: "Connexion réussie", adherent, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Déconnexion d'un adhérent
module.exports.logout = async (req, res) => {
  try {
    res.cookie("jwt_token_adherent", "", { httpOnly: false, maxAge: 1 });
    res.status(200).json("Déconnexion réussie");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
