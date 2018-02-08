
const express = require('express');
const authRouter = express.Router();  

const VerifyToken = require('../middlewares/VerifyToken');

const authController = require('../controllers/auth.controller');

authRouter.get('/me', VerifyToken(), authController.readMe);

authRouter.post('/register', authController.registerUser);

authRouter.post('/login', authController.loginUser);

module.exports = authRouter;