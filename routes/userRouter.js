const express = require('express')

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()

router.patch('/updateMyData', authController.protect, userController.updateMe)

module.exports = router