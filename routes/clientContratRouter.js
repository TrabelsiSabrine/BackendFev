const express = require("express");
const router = express.Router();
const clientContratController = require('../controllers/clientContratController');

router.post("/addClientContrat", clientContratController.addClientContrat);
router.get("/getContratsByClient/:clientId", clientContratController.getContratsByClient);
router.get("/getClientsByProduit/:produitId", clientContratController.getClientsByProduit);
router.delete("/deleteClientContrat/:contratId", clientContratController.deleteClientContrat);

module.exports = router;
