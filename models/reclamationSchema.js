const mongoose = require("mongoose");

const reclamationSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["En attente", "En cours", "Résolue", "Rejetée"],
      default: "En attente",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur associé est obligatoire"],
    },
  },
  { timestamps: true, versionKey: false }
);

reclamationSchema.post("save", async function (doc, next) {
  const User = mongoose.model("User");
  await User.findByIdAndUpdate(doc.user, { $push: { reclamations: doc._id } });
  console.log(`Nouvelle réclamation ajoutée pour l'utilisateur ${doc.user}`);
  next();
});

const Reclamation = mongoose.model("Reclamation", reclamationSchema);
module.exports = Reclamation;
