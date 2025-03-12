const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adherentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
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
    role: {
      type: String,
      enum: ["admin", "client", "infi"],
    },
    user_image: { type: String, default: "" },
    age: { type: Number },
    count: { type: Number, default: 0 },
    produits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Produit" }],
    reclamations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reclamation" }],
    contrats: [{ type: mongoose.Schema.Types.ObjectId, ref: "ClientContrat" }],
    etat: { type: Boolean, default: true },
    ban: { type: Boolean, default: false },
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

    // Vérification et incrémentation de count
    this.count = (this.count ?? 0) + 1;

    next();
  } catch (error) {
    next(error);
  }
});

// Mise à jour automatique des réclamations dans l'adhérent
adherentSchema.post("save", async function (doc, next) {
  console.log("Nouvel adhérent créé :", doc.username);
  next();
});

// Méthode de login
adherentSchema.statics.login = async function (email, mot_de_passe) {
  const adherent = await this.findOne({ email });
  if (adherent) {
    const auth = await bcrypt.compare(mot_de_passe, adherent.mot_de_passe);
    if (auth) {
      if (adherent.etat === true) {
        if (adherent.ban === false) {
          return adherent;
        } else {
          throw new Error("Votre compte est banni");
        }
      } else {
        throw new Error("Compte désactivé");
      }
    } else {
      throw new Error("Mot de passe incorrect");
    }
  } else {
    throw new Error("E-mail non trouvé");
  }
};

const Adherent = mongoose.model("Adherent", adherentSchema);
module.exports = Adherent;
