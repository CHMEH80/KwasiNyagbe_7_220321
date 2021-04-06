//Import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");
const jwtUtils = require("../utils/jwtUtils");
const verifInput = require("../utils/verifInput");

//Création d'un user
exports.signup = (req, res) => {
  // Valider les paramètres de la requète
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (email == null || username == null || password == null) {
    res.status(400).json({ error: "Un de vos paramètres n'est pas valable" });
  }

  //Vérification des saisies user
  const emailOk = verifInput.validEmail(email);
  console.log(emailOk);
  const mdpOK = verifInput.validPassword(password);
  console.log(mdpOK);
  const usernameOk = verifInput.validUsername(username);
  console.log(usernameOk);
  if (emailOk == true && mdpOK == true && usernameOk == true) {
    //Vérification si user n'existe pas déjà
    //Vérifier l'username et l'email
    models.User.findOne({
      attributes: ["email"],
      where: { email: email },
    })
      .then((user) => {
        if (!user) {
          bcrypt.hash(password, 10, function (err, bcryptPassword) {
            // Création de l'user
            const newUser = models.User.create({
              email: email,
              username: username,
              password: bcryptPassword,
              isAdmin: false,
            })
              .then((newUser) => {
                res.status(201).json({ id: newUser.id });
              })
              .catch((err) => {
                res.status(500).json({ err });
              });
          });
        } else {
          res.status(409).json({ error: "Cette utilisateur existe déjà " });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  } else {
    console.log("pas cette fois");
  }
};

//Login d'un user
exports.login = (req, res) => {
  //Récupération et validation des paramètres
  let username = req.body.username;
  let password = req.body.password;
  if (username == null || password == null) {
    return res.status(400).json({ error: "Il manque un paramètre" });
  }
  //Vérification si user existe
  models.User.findOne({
    where: { username: username },
  })
    .then((user) => {
      if (user) {
        bcrypt.compare(
          password,
          user.password,
          (errComparePassword, resComparePassword) => {
            if (resComparePassword) {
              res.status(200).json({
                userId: user.id,
                token: utils.generateToken(user),
                isAdmin: user.isAdmin,
              });
            } else {
              res
                .status(403)
                .json({ error: "Votre mot de passe n'est pas valable" });
            }
          }
        );
      } else {
        res.status(404).json({ erreur: "Cet utilisateur n'existe pas" });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

//Profil d'un user
exports.userProfil = (req, res) => {
  let id = utils.getUserId(req.headers.authorization);
  models.User.findOne({
    attributes: ["id", "email", "username", "isAdmin"],
    where: { id: id },
  })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json(error));
};

//modification d'un profil
exports.changePwd = (req, res) => {
  //TO DO:
  //Récupère l'id de l'user et le nouveau password
  let userId = utils.getUserId(req.headers.authorization);
  const newPassword = req.body.newPassword;
  console.log(newPassword);
  //Vérification regex du nouveau mot de passe
  console.log("admin", verifInput.validPassword(newPassword));
  if (verifInput.validPassword(newPassword)) {
    //Vérifie qu'il est différent de l'ancien
    models.User.findOne({
      where: { id: userId },
    })
      .then((user) => {
        console.log("user trouvé", user);
        bcrypt.compare(
          newPassword,
          user.password,
          (errComparePassword, resComparePassword) => {
            //bcrypt renvoit resComparePassword si les mdp sont identiques donc aucun changement
            if (resComparePassword) {
              res
                .status(406)
                .json({ error: "Vous avez entré le même mot de passe" });
            } else {
              bcrypt.hash(newPassword, 10, function (err, bcryptNewPassword) {
                models.User.update(
                  { password: bcryptNewPassword },
                  { where: { id: user.id } }
                )
                  .then(() =>
                    res
                      .status(201)
                      .json({
                        confirmation: "mot de passe modifié avec succès",
                      })
                  )
                  .catch((err) => res.status(500).json(err));
              });
            }
          }
        );
      })
      .catch((err) => json(err));
  } else {
    res.status(406).json({ error: "mot de passe non valide" });
  }
};

//Suppression d'un compte
exports.deleteProfile = (req, res) => {
  //récupération de l'id de l'user
  let userId = utils.getUserId(req.headers.authorization);
  if (userId != null) {
    //Recherche sécurité si user existe bien
    models.User.findOne({
      where: { id: userId },
    }).then((user) => {
      if (user != null) {
        //Delete de tous les posts de l'user même s'il y en a pas
        models.Post.destroy({
          where: { userId: user.id },
        })
          .then(() => {
            console.log("Tous les posts de cet user ont été supprimé");
            //Suppression de l'utilisateur
            models.User.destroy({
              where: { id: user.id },
            })
              .then(() => res.end())
              .catch((err) => console.log(err));
          })
          .catch((err) => res.status(500).json(err));
      } else {
        res.status(401).json({ error: "Cet user n'existe pas" });
      }
    });
  } else {
    res
      .status(500)
      .json({
        error: "Impossible de supprimer ce compte, contacter un administrateur",
      });
  }
};
