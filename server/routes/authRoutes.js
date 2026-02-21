const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, getMe } = require('../controllers/authController');

router.post(
    '/register',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 })
    ],
    register
);

router.post(
    '/login',
    [body('email').isEmail(), body('password').exists()],
    login
);

router.get('/me', authMiddleware, getMe);

module.exports = router;