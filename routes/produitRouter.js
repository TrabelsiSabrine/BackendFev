const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produitController");

router.post("/addProduit", produitController.addProduit);
router.get("/getProduitById/:id", produitController.getProduitById);
router.put("/updateProduit/:id", produitController.updateProduit);
router.delete("/deleteProduitById/:id", produitController.deleteProduitById);
router.get("/getProduitsByLibelle/:libelleProduit", produitController.getProduitsByLibelle);

module.exports = router;
