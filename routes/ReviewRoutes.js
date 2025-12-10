const express = require('express');
const Reviewrouter = express.Router();
const {createReview, getReviewsByTour} = require('../controllers/ReviewController');
const {verifyToken} = require('../middleware/TokenMiddleware');

Reviewrouter.use(verifyToken);

Reviewrouter.route('/')
    .post(createReview);

Reviewrouter.route('/:tourID')
    .get(getReviewsByTour);

module.exports = Reviewrouter;