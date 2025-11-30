const express = require('express');
const AdminRouter = express.Router();
const {createTour, getAllToursAdmin, deleteTour, updateTourStatus} = require('../controllers/AdminController');
const {validateCreateTour} = require('../middleware/AuthMiddleware');

AdminRouter.route('/tours')
    .post(validateCreateTour, createTour)
    .get(getAllToursAdmin);

AdminRouter.route('/tours/:tourID')
    .delete(deleteTour)
    .put(updateTourStatus);
    
module.exports = AdminRouter;