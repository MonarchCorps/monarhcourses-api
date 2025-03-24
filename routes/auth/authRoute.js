const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth/authController')

router.post('/login', authController.login)
router.post('/refresh', authController.refreshToken)
router.get('/logout', authController.logout)

module.exports = router