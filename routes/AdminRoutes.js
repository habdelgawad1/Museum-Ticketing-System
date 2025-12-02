const express = require('express');
const AdminRouter = express.Router();
const {createTour, getAllToursAdmin, deleteTour, updateTourStatus, createAdmin, deleteAdmin} = require('../controllers/AdminController');
const {validateSignup} = require('../middleware/AuthMiddleware');

AdminRouter.route('/admins')
    .post(validateSignup, createAdmin);

AdminRouter.route('/admins/:adminID')
    .delete(deleteAdmin);

AdminRouter.route('/tours')
    .post(createTour)
    .get(getAllToursAdmin);

AdminRouter.route('/tours/:tourID')
    .delete(deleteTour)
    .put(updateTourStatus);

module.exports = AdminRouter;