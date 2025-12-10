const express = require('express');
const UserRouter = express.Router();
const { updateProfile, deleteUser, getUserProfile } = require('../controllers/UserController');
const { validateUpdateProfile }= require('../middleware/UserMiddleware');
const { verifyToken, isOwner } = require('../middleware/TokenMiddleware');

UserRouter.use(verifyToken);

UserRouter.route("/update")
    .put(validateUpdateProfile, isOwner, updateProfile);

UserRouter.route("/delete")
    .delete(isOwner, deleteUser);

UserRouter.route("/profile/:userID")
    .get(isOwner, getUserProfile);

module.exports = UserRouter;