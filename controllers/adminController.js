const userModel = require('../models/userSchema');

module.exports.addAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const roleAdmin = 'admin';

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        const newAdmin = new userModel({ username, email, password, role: roleAdmin });

        await newAdmin.save();
        res.status(201).json({ admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getAllAdmins = async (req, res) => {
    try {
        const adminList = await userModel.find({ role: "admin" });
        res.status(200).json({ adminList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const admin = await userModel.findById(id);
        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ message: "Administrateur non trouvé" });
        }

        const updatedAdmin = await userModel.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ message: "Administrateur mis à jour avec succès", admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await userModel.findById(id);

        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ message: "Administrateur non trouvé" });
        }

        await userModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Administrateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
