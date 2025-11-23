const express = require('express');
const AuthRouter = express.Router();
const { signup, login } = require('../controllers/AuthController.js');

AuthRouter.route("/register")
    .post(signup);

AuthRouter.route("/login")
    .post(login);

module.exports = AuthRouter;