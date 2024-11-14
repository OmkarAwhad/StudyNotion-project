const express = require('express')
const router = express.Router();
const { authN, isStudent } = require('../middlewares/auth.middlewares');
const { capturePayment, verifySignature } = require('../controllers/payments.controllers');


router.post("/capturePayment", authN, isStudent, capturePayment)
router.post("/verifyPayment",authN, isStudent, verifySignature)
// router.post("/sendPaymentSuccessEmail", authN, isStudent, sendPaymentSuccessEmail);

module.exports = router;