const express = require('express');
const UserRouter = express.Router();
const { updateProfile } = require('../controllers/UserController');
const validateUpdateProfile = require('../middleware/UserMiddleware');

UserRouter.route("/update")
    .put(validateUpdateProfile, updateProfile);

module.exports = router;