const express = require('express');
const { updateProfile, deleteProfile, getAllUserDetails ,updateDisplayPicture } = require('../controllers/profile.controllers');
const { authN } = require('../middlewares/auth.middlewares');
const router = express.Router();

router.put('/updateProfile' , authN , updateProfile)
router.delete('/deleteProfile' , authN , deleteProfile)
router.get('/getUserDetails' , authN , getAllUserDetails)
router.put('/updateDisplayPicture' , authN , updateDisplayPicture)

module.exports = router;