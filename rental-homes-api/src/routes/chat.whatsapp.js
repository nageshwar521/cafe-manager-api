const express = require('express');
const chatService = require('../services/ChatService');

const router = express.Router();

router.get('/', chatService.getChats);

router.get('/:phone', chatService.getChatById);

router.post('/message/:phone', chatService.sendMessage);

router.post('/location/:phone', chatService.sendLocation);

router.post('/media/:phone', chatService.sendMedia);

module.exports = router;