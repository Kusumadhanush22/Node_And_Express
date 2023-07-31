const toursController = require('../controllers/tours-controller')
const authController = require('../controllers/auth-controller')
const express = require('express')
const router = express.Router()

router.route('/').get(authController.protect,authController.restrictTo('admin'),toursController.getAllTours).post(toursController.postTour)
router.route('/:id').get(toursController.getTour).patch(toursController.updateTour).delete(toursController.deleteTour)

module.exports = router
