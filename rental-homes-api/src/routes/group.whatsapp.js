const express = require('express');
const groupService = require('../services/GroupService');

const router = express.Router();

router.post('/:groupName', groupService.sendMessage);

router.post('/:groupName/media', groupService.sendMedia);

router.post('/:groupName/location', groupService.sendLocation);

module.exports = router;