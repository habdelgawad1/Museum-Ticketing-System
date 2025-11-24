const express = require('express');
const UserRouter = express.Router();
const { updateProfile, deleteUser } = require('../controllers/UserController');
const { validateUpdateProfile }= require('../middleware/UserMiddleware');
const { authenticateToken } = require('../middleware/AuthMiddleware');

UserRouter.route("/update")
    .put(authenticateToken, validateUpdateProfile, updateProfile);

UserRouter.route("/delete")
    .delete(authenticateToken, deleteUser);

module.exports = UserRouter;