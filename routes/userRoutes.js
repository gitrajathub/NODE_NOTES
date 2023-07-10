const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/userModel');

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.delete('/delete', userController.deleteUser);
router.put('/update', userController.updateUser);


module.exports = router;