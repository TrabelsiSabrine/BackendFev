const mongoose = require('mongoose');

const connectToMongoDb = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MongoDb_Url);
    console.log("✅ Connecté à MongoDB !");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1); // Arrête le serveur en cas d'échec
  }
};

module.exports = { connectToMongoDb };
