const express = require('express');
const contactService = require('../services/ContactService');

const router = express.Router();

router.get('/', contactService.getContacts);

router.get('/:phone', contactService.getContactById);

router.get('/:phone/profile_picture', contactService.getProfilePicUrl);

router.get('/:phone/is_registered', contactService.isRegisteredUser);

module.exports = router;