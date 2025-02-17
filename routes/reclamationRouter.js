const express = require("express");
const router = express.Router();
const reclamationController = require("../controllers/reclamationController");

// Routes pour les réclamations
router.get("/", reclamationController.getAllReclamations);
router.get("/:id", reclamationController.getReclamationById);
router.post("/addReclamation", reclamationController.addReclamation);
router.put("/:id", reclamationController.updateReclamation);
router.delete("/:id", reclamationController.deleteReclamation);

module.exports = router;
