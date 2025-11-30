const express = require('express');
const UserRouter = express.Router();
const { updateProfile, deleteUser, getUserProfile } = require('../controllers/UserController');
const { validateUpdateProfile }= require('../middleware/UserMiddleware');

UserRouter.route("/update")
    .put(validateUpdateProfile, updateProfile);

UserRouter.route("/delete")
    .delete(deleteUser);

UserRouter.route("/profile/:userID")
    .get(getUserProfile);

module.exports = UserRouter;