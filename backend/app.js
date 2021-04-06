// package express pour lancer le serveur
const express = require("express");
// @ts-ignore
// pour lutter contre les attaque de type déni de service distribué ddos
const Ddos = require("ddos");
const ddos = new Ddos({ burst: 10, limit: 15 });

// protéger l’application de certaines des vulnérabilités web
const helmet = require("helmet");

// accès de notre système de chemin de fichier images
const path = require("path");

// Routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// Utilisation du Framework Express
const app = express();

app.use(ddos.express);

app.use(helmet());

// Middleware pour les headers de requêtes et éviter les erreurs CORS (une sécurité qui empêche les reqêtes mailleveilantes)

app.use((req, res, next) => {
  // rajout des headers pour permettre que tous les utilisateur depuis n'importe quel navigateur puissent faire les requêtes nécessaires pour accéder à notre api
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Traitement des sonnées par BodyParser pour donner accès au corps de la requête
app.use(express.json());
// Chemin virtuel pour les fichiers statiques tel que nos images
app.use("/images", express.static(path.join(__dirname, "images")));
// Urls des routes auquelless l'aplication front fera appel
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// export de la constante app pour accès depuis les autres fichiers
module.exports = app;
