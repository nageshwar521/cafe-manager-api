const express = require('express');
const authService = require('../services/AuthService');

const router = express.Router();

router.get('/', authService.getQrCode);

module.exports = router;