const client = require('../../clientWhatsapp');

async function getContacts(request, response) {
    try {
        const contacts = await client.getContacts();
        return response.status(200).send({
            message: 'Contacts retrieved successfully',
            contacts
        });
    }
    catch (err) {
        console.error('Failed to get contacts', err);
        return response.status(500).send('Failed to get contacts');
    }
}

async function getContactById(request, response) {
    try {
        const { phone } = request.params;
        const contact = await client.getContactById(`${phone}@c.us`);
        return response.status(200).send({
            message: 'Contact retrieved successfully',
            contact
        });
    }
    catch (err) {
        console.error('Failed to get contact', err);
        return response.status(500).send('Failed to get contact');
    }

}

async function getProfilePicUrl(request, response) {
    try {
        const { phone } = request.params;
        const url = await client.getProfilePicUrl(`${phone}@c.us`);
        return response.status(200).send({
            message: 'Profile pic url retrieved successfully',
            url
        });
    }
    catch (err) {
        console.error('Failed to get profile pic url', err);
        return response.status(500).send('Failed to get profile pic url');
    }
}

async function isRegisteredUser(request, response) {
    try {
        const { phone } = request.params;
        const isRegistered = await client.isRegisteredUser(`${phone}@c.us`);
        return response.status(200).send({
            message: 'Is registered user?',
            isRegistered
        });
    }
    catch (err) {
        console.error('Failed to check if user is registered', err);
        return response.status(500).send('Failed to check if user is registered');
    }
}

const ContactService = {
    getContacts,
    getContactById,
    getProfilePicUrl,
    isRegisteredUser
}

module.exports = ContactService;