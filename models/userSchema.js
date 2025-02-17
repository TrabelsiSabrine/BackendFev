const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
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
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
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
    contrats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contrat' }], // Ajout de la référence aux contrats
  },
  { timestamps: true, versionKey: false } // Désactiver __v
);

// Hashage du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Vérification et incrémentation de count
    this.count = (this.count ?? 0) + 1;

    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Log après la sauvegarde
userSchema.post("save", async function (doc, next) {
  console.log("✅ Nouvel utilisateur créé :", doc.username);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
