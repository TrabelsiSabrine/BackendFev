var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { connectToMongoDb } = require("./config/db");//importation

require("dotenv").config(); //configuration dotenv

const http = require('http');
var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/usersRouter');//nasna3 serveur
var osRouter = require('./routes/osRouter');





var app = express();

// Configuration du moteur de template
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Définition des routes
app.use('/', indexRouter);
app.use("/users", usersRouter);
app.use("/os", osRouter);


// Gestion des erreurs 404
app.use((req, res, next) => {
  next(createError(404));
});

// Gestion des erreurs générales
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Création du serveur
const server = http.createServer(app);
const port = process.env.PORT || 5001; // Utilise 5001 par défaut si PORT n'est pas défini
server.listen(port, async () => { 
  await connectToMongoDb(); 
  console.log(`✅ Serveur démarré sur le port ${port}!`);
});

