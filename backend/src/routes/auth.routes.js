const express = require('express');
const authController = require("../controllers/auth.controller")

const router = express.Router();

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
router.post('/google/user', authController.googleUserLogin) // Added Google User Login route

// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)
router.post('/google/food-partner', authController.googleFoodPartnerLogin) // Added Google Food Partner Login route


module.exports = router;