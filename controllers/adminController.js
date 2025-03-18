const Admin = require("../models/adminSchema");
const jwt = require("jsonwebtoken");

const maxTime = 24 * 60 * 60; // 24H
const createToken = (id) => {
  return jwt.sign({ id }, "net secret pfe", { expiresIn: maxTime });
};

module.exports.addAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const newAdmin = new Admin({ email, mot_de_passe });

    await newAdmin.save();
    res.status(201).json({ admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllAdmins = async (req, res) => {
  try {
    const adminList = await Admin.find();
    res.status(200).json({ adminList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: "Admin mis à jour", admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: "Admin supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const admin = await Admin.login(email, mot_de_passe);
    const token = createToken(admin._id);
    res.status(200).json({ admin, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
