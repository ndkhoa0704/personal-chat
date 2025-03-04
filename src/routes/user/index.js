const express = require('express');
const userCtrl = require('./userCtrl');
const { authenticate } = require('../../middlewares/auth');

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', userCtrl.register);

/**
 * @route POST /api/users/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', userCtrl.login);

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticate, userCtrl.getProfile);

module.exports = router;