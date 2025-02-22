const userModel = require('../models/userSchema');

module.exports.addClient = async (req, res) => {
    try {
        const { username, email, password, age } = req.body;
        const roleClient = 'client';

        // Vérifier si l'email existe déjà
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        const newClient = new userModel({ username, email, password, role: roleClient, age });

        await newClient.save();
        res.status(201).json({ client: newClient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addClientWithImg = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { filename } = req.file;
        const roleClient = 'client';

        const client = await userModel.create({
            username, email, password, role: roleClient, user_image: filename
        });

        res.status(201).json({ client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAllClients = async (req, res) => {
    try {
        const clientList = await userModel.find({ role: "client" });
        res.status(200).json({ clientList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await userModel.findById(id);

        if (!client || client.role !== "client") {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        res.status(200).json({ client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const client = await userModel.findById(id);
        if (!client || client.role !== "client") {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        const updatedClient = await userModel.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ message: "Client mis à jour avec succès", client: updatedClient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await userModel.findById(id);

        if (!client || client.role !== "client") {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        await userModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Client supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.searchClientByUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            throw new Error("Veuillez fournir un nom pour la recherche.");
        }

        const clientList = await userModel.find({
            username: { $regex: username, $options: "i" },
            role: "client"
        });

        if (!clientList.length) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        const count = clientList.length;
        res.status(200).json({ clientList, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAllClientsSortByAge = async (req, res) => {
    try {
        const clientList = await userModel.find({ role: "client" }).sort({ age: 1 }).limit(2);
        res.status(200).json({ clientList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Récupérer les clients d'un âge spécifique
module.exports.getAllClientsByAge = async (req, res) => {
    try {
        const { age } = req.params;
        const clientList = await userModel.find({ age: age, role: "client" });

        res.status(200).json({ clientList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Récupérer les clients entre un âge min et max
module.exports.getAllClientsBetweenAges = async (req, res) => {
    try {
        const { MaxAge, MinAge } = req.query;
        if (!MaxAge || !MinAge) {
            return res.status(400).json({ message: "Veuillez fournir un âge minimum et maximum." });
        }

        const clientList = await userModel.find({
            age: { $gt: MinAge, $lt: MaxAge },
            role: "client"
        }).sort({ age: 1 });

        res.status(200).json({ clientList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
