// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const authMiddleware = require('../middleware/authMiddleware');
// const { register, login, getMe } = require('../controllers/authController');

// router.post(
//     '/register',
//     [
//         body('name').notEmpty(),
//         body('email').isEmail(),
//         body('password').isLength({ min: 6 })
//     ],
//     register
// );

// router.post(
//     '/login',
//     [body('email').isEmail(), body('password').exists()],
//     login
// );

// router.get('/me', authMiddleware, getMe);

// module.exports = router;

//******************************************************** */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
// ✅ NEW: Import upload middleware
const upload = require('../middleware/upload');

const {
    register,
    login,
    getMe,
    verifyOtp,      // ✅ NEW
    resendOtp       // ✅ NEW
} = require('../controllers/authController');

// ✅ UPDATED: Register route with file upload and validation
router.post(
    '/register',
    upload.single('aadharImage'), // ✅ NEW: Handle file upload
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        body('dateOfBirth').isISO8601(), // ✅ NEW
        body('aadharNumber').isLength({ min: 12, max: 12 }).isNumeric() // ✅ NEW
    ],
    register
);

// ✅ NEW: OTP verification routes
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

router.post(
    '/login',
    [body('email').isEmail(), body('password').exists()],
    login
);

router.get('/me', authMiddleware, getMe);

module.exports = router;