const express = require('express');
const { updateProfile, deleteProfile, getAllUserDetails } = require('../controllers/profile.controllers');
const router = express.Router();

router.post('/updateProfile', updateProfile)
router.post('/deleteProfile', deleteProfile)
router.post('/getAllUserDetails', getAllUserDetails)

module.exports = router;