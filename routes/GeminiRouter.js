const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialisation de l'API Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyBbkvfs6eLVsN-6-OM777L2ajq_BksaFXI");

// Route pour générer du texte avec Gemini
router.post("/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
  
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      const result = await model.generateContent(prompt);
      console.log("Réponse de l'API Gemini:", result); // Log de la réponse
  
      // Assure-toi de la bonne structure de la réponse
      const response = result.response ? result.response.text() : 'Aucun texte généré';
      
      res.json({ generatedText: response });
  
    } catch (error) {
      console.error("Erreur API Gemini :", error);
      res.status(500).json({ error: "Erreur lors de la génération du contenu." });
    }
  });
  
module.exports = router;