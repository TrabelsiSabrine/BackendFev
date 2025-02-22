var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { connectToMongoDb } = require("./config/db");

// gemini
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;
 


require("dotenv").config();

const http = require("http"); // Importation du module HTTP

// Importation des routeurs
var indexRouter = require("./routes/indexRouter");
var osRouter = require("./routes/osRouter");
var reclamationRouter = require("./routes/reclamationRouter");
var produitRouter = require("./routes/produitRouter");
var adminRouter = require("./routes/adminRouter");
var clientRouter = require("./routes/clientRouter");
var clientContratRouter = require("./routes/clientContratRouter");
var GeminiRouter = require('./routes/GeminiRouter');  // Adjust path as needed

var app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Utilisation des routeurs existants
app.use("/", indexRouter);
app.use("/os", osRouter);
app.use("/reclamations", reclamationRouter);
app.use("/produits", produitRouter);
app.use("/admins", adminRouter);
app.use("/clients", clientRouter);
app.use("/client-contrats", clientContratRouter);
app.use("/Gemini", GeminiRouter);


// Gestion des erreurs 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Gestion des erreurs globales
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Création du serveur HTTP
const server = http.createServer(app);

const PORT = process.env.PORT || 5001; // Définit un port par défaut

server.listen(PORT, () => {
  connectToMongoDb();
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
