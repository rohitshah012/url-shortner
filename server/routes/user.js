const express = require("express");
const { handleUserSignup } = require("../controllers/user");

const Router = express.Router();


Router.post('/', handleUserSignup)

module.exports = Router;
