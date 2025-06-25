const express = require('express');
const router = express.Router();
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    verifyResetCode,
    resetPasswordWithCode
} = require('../controllers/authController.js');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-code', verifyResetCode);
router.post('/reset-password-code', resetPasswordWithCode);

module.exports = router;
