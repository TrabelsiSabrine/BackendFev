const express = require("express");
const router = express.Router();
const reclamationController = require("../controllers/reclamationController");

// ➤ Routes pour gérer les réclamations
router.post("/addReclamation", reclamationController.addReclamation);
router.get("/getAllReclamations", reclamationController.getAllReclamations); 
router.get("/getReclamationById/:id", reclamationController.getReclamationById);
router.put("/updateReclamationById/:id", reclamationController.updateReclamationById); 
router.delete("/deleteReclamationById/:id", reclamationController.deleteReclamationById); 

module.exports = router;
