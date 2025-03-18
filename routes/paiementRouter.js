const express = require("express");
const router = express.Router();
const paiementController = require("../controllers/paiementController");

router.post("/addPaiement", paiementController.addPaiement);
router.get("/getPaiementById/:id", paiementController.getPaiementById);
router.put("/updatePaiement/:id", paiementController.updatePaiement);
router.delete("/deletePaiementById/:id", paiementController.deletePaiementById);

module.exports = router;
