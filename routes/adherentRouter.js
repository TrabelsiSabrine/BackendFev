const express = require("express");
const router = express.Router();
const multer = require("multer"); // Pour gérer les fichiers (si vous avez une image)
const path = require("path");

const adherentController = require("../controllers/adherentController");

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Spécifier le dossier de destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom de fichier unique
  }
});
const upload = multer({ storage });

// Routes pour les adhérents
router.post("/addAdherent", adherentController.addAdherent); // Ajouter un adhérent sans image
router.post("/addAdherentWithImg", upload.single("user_image"), adherentController.addAdherentWithImg); // Ajouter un adhérent avec image

router.get("/all", adherentController.getAllAdherents); // Récupérer tous les adhérents
router.get("/:id", adherentController.getAdherentById); // Récupérer un adhérent par ID

router.put("/:id", adherentController.updateAdherent); // Mettre à jour un adhérent
router.delete("/deleteAdherentById/:id", adherentController.deleteAdherentById); // Supprimer un adhérent

router.get("/searchAdherentByNomPrenom", adherentController.searchAdherentByNomPrenom); // Recherche d'adhérents par nom ou prénom
router.get("/getAllAdherentsSortByAge", adherentController.getAllAdherentsSortByAge); // Récupérer les adhérents triés par âge
router.get("/getAdherentsByAge/:age", adherentController.getAdherentsByAge); // Récupérer les adhérents d'un âge spécifique
router.get("/getAdherentsBetweenAges", adherentController.getAdherentsBetweenAges); // Récupérer les adhérents entre un âge min et max

module.exports = router;
