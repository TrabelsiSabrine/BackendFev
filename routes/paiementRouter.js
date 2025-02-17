const express = require("express");
const router = express.Router();
const paiementController = require("../controllers/paiementController");

// Routes pour les paiements
router.get("/", paiementController.getAllPaiements);
router.get("/:id", paiementController.getPaiementById);
router.post("/addPaiement", paiementController.addPaiement);
router.put("/:id", paiementController.updatePaiement);
router.delete("/:id", paiementController.deletePaiement);

module.exports = router;
