var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { connectToMongoDb } = require("./config/db");

require("dotenv").config();

const http = require("http"); // Importation du module HTTP

var indexRouter = require("./routes/indexRouter");
var usersRouter = require("./routes/usersRouter");
var osRouter = require("./routes/osRouter");
var contratRouter = require("./routes/contratRouter");
var paiementRouter = require("./routes/paiementRouter");
var reclamationRouter = require("./routes/reclamationRouter");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/os", osRouter);
app.use('/contrats', contratRouter);
app.use("/paiements", paiementRouter);
app.use("/reclamations", reclamationRouter);

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

//Ajout de cette ligne pour créer le serveur HTTP
const server = http.createServer(app);

const PORT = process.env.PORT || 5001; // Définit un port par défaut
server.listen(PORT, () => {
  connectToMongoDb();
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
