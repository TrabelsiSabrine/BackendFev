const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
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
  },
  { timestamps: true }
);

// Hashage du mot de passe avant sauvegarde
adminSchema.pre("save", async function (next) {
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

// Méthode pour vérifier le mot de passe
adminSchema.statics.login = async function (email, mot_de_passe) {
  const admin = await this.findOne({ email });
  if (admin) {
    const isPasswordValid = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (isPasswordValid) {
      return admin;
    } else {
      throw new Error("Mot de passe invalide");
    }
  } else {
    throw new Error("Utilisateur non trouvé");
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
