//Imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");

module.exports = {
  isAdmin: function (user) {
    return true;
  },
};
