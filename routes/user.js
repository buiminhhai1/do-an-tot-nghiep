const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user');

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/me', passport.authenticate('jwt', {session: false}), userController.getCurrentUser);

module.exports = router;
