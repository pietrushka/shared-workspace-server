const express = require('express')

const authController = require('../controllers/authController')

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/isLoggedIn', authController.isLoggedIn)

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);


module.exports = router