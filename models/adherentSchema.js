const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adherentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Veuillez entrer une adresse e-mail valide"],
    },
    mot_de_passe: {
      type: String,
      required: true,
      minLength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
      ],
    },
    user_image: { type: String, default: "" },
    numeroAdherent: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    age: { type: Number, required: true },
    telephone: { type: String, required: true },
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    dateInscription: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hashage du mot de passe avant sauvegarde
adherentSchema.pre("save", async function (next) {
  try {
    if (this.isModified("mot_de_passe")) {
      const salt = await bcrypt.genSalt();
      this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode de login avec numeroAdherent
adherentSchema.statics.login = async function (numeroAdherent, mot_de_passe) {
  const adherent = await this.findOne({ numeroAdherent });
  if (adherent) {
    const auth = await bcrypt.compare(mot_de_passe, adherent.mot_de_passe);
    if (auth) {
      return adherent;
    } else {
      throw new Error("Mot de passe incorrect");
    }
  } else {
    throw new Error("Numéro d'adhérent non trouvé");
  }
};

const Adherent = mongoose.model("Adherent", adherentSchema);
module.exports = Adherent;
