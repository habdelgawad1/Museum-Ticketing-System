const express = require('express');
const AuthRouter = express.Router();
const { signup, login } = require('../controllers/AuthController.js');
const {validateSignup, validateLogin} = require('../middleware/AuthMiddleware.js');

AuthRouter.route("/register")
    .post(validateSignup, signup);

AuthRouter.route("/login")
    .post(validateLogin, login);

module.exports = AuthRouter;