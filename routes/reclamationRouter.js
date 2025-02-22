const express = require("express");
const router = express.Router();
const reclamationController = require("../controllers/reclamationController");

router.post("/addReclamation", reclamationController.addReclamation);
router.get("/getReclamationsByUser/:userId", reclamationController.getReclamationsByUser);
router.get("/getAllReclamations", reclamationController.getAllReclamations); 
router.get("/getReclamationById/:id", reclamationController.getReclamationById);
router.put("/updateReclamationById/:id", reclamationController.updateReclamationById); 
router.delete("/deleteReclamationById/:id", reclamationController.deleteReclamationById);

router.put("/affectReclamation", reclamationController.affectReclamation);
router.put("/desaffectReclamation", reclamationController.desaffectReclamation);

module.exports = router;
