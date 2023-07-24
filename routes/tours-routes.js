const toursCollection = require('../controllers/tours-controller')
const express = require('express')
const router = express.Router()

router.route('/').get(toursCollection.getAllTours).post(toursCollection.postTour)
router.route('/:id').get(toursCollection.getTour).patch(toursCollection.updateTour).delete(toursCollection.deleteTour)

module.exports = router
