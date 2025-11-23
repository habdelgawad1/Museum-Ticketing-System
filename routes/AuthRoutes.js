const express = require('express');
const AuthRouter = express.Router();
const { signup, login } = require('../controllers/AuthController.js');

API = '/api/v1'

AuthRouter.route(API + "/register")
    .post(signup);

AuthRouter.route(API + "/login")
    .post(login);

module.exports = router;