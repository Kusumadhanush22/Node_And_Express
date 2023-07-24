const express = require('express');
const userControllers = require('../controllers/users-controller')
const authControllers = require('../controllers/auth-controller');
const router = express.Router(authControllers.signup);

router.route('/signup').post(authControllers.signup);
router.route('/').get(userControllers.getAllUsers).post(userControllers.postUser);
router.route('/:id').get(userControllers.getUser).delete(userControllers.deleteUser).patch(userControllers.updateUser)

module.exports = router