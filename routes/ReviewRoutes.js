const express = require('express');
const Reviewrouter = express.Router();
const {createReview, getReviewsByTour} = require('../controllers/ReviewController');

Reviewrouter.route('/')
    .post(createReview);

Reviewrouter.route('/tour/:tourID')
    .get(getReviewsByTour);

module.exports = Reviewrouter;