const express = require('express');
const AdminRouter = express.Router();
const {createTour, getAllToursAdmin, deleteTour, updateTourStatus} = require('../controllers/AdminController');

AdminRouter.route('/tours')
    .post(createTour)
    .get(getAllToursAdmin);

AdminRouter.route('/tours/:tourID')
    .delete(deleteTour)
    .put(updateTourStatus);

module.exports = AdminRouter;