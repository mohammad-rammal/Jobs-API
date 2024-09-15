const express = require('express');
const {register, login} = require('../controllers/auth');
const router = express.Router();

// /api/v1/auth/register
router.route('/register').post(register);

// /api/v1/auth/login
router.route('/login').post(login);

module.exports = router;
