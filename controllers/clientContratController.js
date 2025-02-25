const ClientContrat = require('../models/clientContratSchema');
const User = require('../models/userSchema');
const Produit = require('../models/produitSchema');
const clientContratSchema = require('../models/clientContratSchema');


module.exports.addClientContrat = async (req, res) => {
    try {
        const { clientId, contratId, numeroDeContrat, prix, modePaiement, dateDebut, dateFin, dateSignature, statut } = req.body;

        // // Vérifier si le client existe
        // const client = await User.findById(clientId);
        // if (!client) {
        //     return res.status(404).json({ message: "Client non trouvé" });
        // }

        // // Vérifier si le produit (contrat) existe
        // const produit = await Produit.findById(contratId);
        // if (!produit) {
        //     return res.status(404).json({ message: "Contrat (Produit) non trouvé" });
        // }

        // Créer l'association client - contrat
        const newClientContrat = await clientContratSchema.create({
            client: clientId,
            contrat: contratId,
            numeroDeContrat,
            prix,
            modePaiement,
            dateDebut,
            dateFin,
            dateSignature,
            statut
        });

        await newClientContrat.save();

        // Ajouter l'ID du contrat dans les références du client et du produit
        // await userModel.findByIdAndUpdate(clientId,{
        //     $push:{ contrats: contratId}
        // })
        //client.contrats.push(newClientContrat._id);
        //produit.contrats.push(newClientContrat._id);

        // await client.save();
        // await produit.save();

        res.status(201).json({  newClientContrat });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports.getContratsByClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        const clientContrats = await ClientContrat.find({ client: clientId })
            .populate('contrat', 'nom tarif description') // Optimisation en spécifiant les champs
            .populate('client', 'username email');

        if (!clientContrats.length) {
            return res.status(404).json({ message: "Aucun contrat trouvé pour ce client" });
        }

        res.status(200).json({ clientContrats });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports.getClientsByProduit = async (req, res) => {
    try {
        const { produitId } = req.params;

        const clients = await ClientContrat.find({ contrat: produitId })
            .populate('client', 'username email')
            .populate('contrat', 'nom tarif');

        if (!clients.length) {
            return res.status(404).json({ message: "Aucun client trouvé pour ce produit" });
        }

        res.status(200).json({ clients });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports.deleteClientContrat = async (req, res) => {
    try {
        const { contratId } = req.params;

        const contrat = await ClientContrat.findByIdAndDelete(contratId);
        if (!contrat) {
            return res.status(404).json({ message: "Contrat non trouvé" });
        }

        await User.findByIdAndUpdate(contrat.client, { $pull: { contrats: contratId } });
        await Produit.findByIdAndUpdate(contrat.contrat, { $pull: { contrats: contratId } });

        res.status(200).json({ message: "Contrat supprimé avec succès" });
    } catch (error) {
        handleError(res, error);
    }
};
