const express = require('express');
const TourRouter = express.Router();
const { getAllTours, getTourById, getToursByGuide } = require('../controllers/TourController');

TourRouter.route("/")
    .get(getAllTours);

TourRouter.route("/guide/:guideId")
    .get(getToursByGuide);

TourRouter.route("/:id")
    .get(getTourById);

module.exports = TourRouter;