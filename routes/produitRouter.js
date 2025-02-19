const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produitController");

router.post("/addProduit", produitController.addProduit);
router.get("/getAllProduits", produitController.getAllProduits);
router.get("/getProduitById/:id", produitController.getProduitById);
router.put("/updateProduit/:id", produitController.updateProduit);
router.delete("/deleteProduit/:id", produitController.deleteProduit);

module.exports = router;
