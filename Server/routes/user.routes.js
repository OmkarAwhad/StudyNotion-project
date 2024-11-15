const express = require('express');
const { sendOTP, login, signUp, changePassword } = require('../controllers/auth.controllers');
const { resetPasswordToken, resetPassword } = require('../controllers/resetPassword.controllers');
const router = express.Router();
const { authN } = require('../middlewares/auth.middlewares')


router.post('/sendotp',sendOTP);
router.post('/login', login);
router.post('/signup', signUp);
router.post('/changePassword', authN, changePassword);

router.post('/reset-password-token',resetPasswordToken)
router.post('/reset-password',resetPassword)


module.exports = router;
