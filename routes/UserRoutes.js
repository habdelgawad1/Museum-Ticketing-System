const express = require('express');
const UserRouter = express.Router();
const { updateProfile, deleteUser } = require('../controllers/UserController');
const { validateUpdateProfile }= require('../middleware/UserMiddleware');

UserRouter.route("/update")
    .put(validateUpdateProfile, updateProfile);

UserRouter.route("/delete")
    .delete(deleteUser);

module.exports = UserRouter;