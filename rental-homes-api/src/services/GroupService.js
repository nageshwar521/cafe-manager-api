const pkg = require("whatsapp-web.js");
const client = require('../../clientWhatsapp.js');
const { MessageMedia, Location } = pkg;

async function sendMessage(request, response) {
    try {
        const { groupName } = request.params;
        const { message } = request.body;
        const chats = await client.getChats();
        const chat = chats.find(chat => chat.name === groupName && chat.id.server === 'g.us');
        if (!chat)
            return response.status(400).send({
                message: 'Invalid parameters'
            });

        await client.sendMessage(chat.id._serialized, message);
        return response.status(200).send({
            message: 'Message sent successfully'
        });

    }
    catch (err) {
        console.error('Failed to send message in group', err);
        return response.status(500).send('Failed to send message in group');
    }
}

async function sendMedia(request, response) {
    try {
        const { groupName } = request.params;
        const { url, message } = request.body;
        if (!url || !groupName)
            return response.status(400).send({
                message: 'Invalid parameters'
            });

        const chats = await client.getChats();
        const chat = chats.find(chat => chat.name === groupName && chat.id.server === 'g.us');
        if (!chat)
            return response.status(400).send({
                message: 'Group does not exist'
            });

        const media = MessageMedia.fromUrl(url);
        await client.sendMessage(chat.id._serialized, media, { caption: message });
        return response.status(200).send({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error('Failed to send media in group', err);
        return response.status(500).send('Failed to send media in group');
    }
}

async function sendLocation(request, response) {
    try {
        const { groupName } = request.params;
        const { latitude, longitude, message } = request.body;
        if (!latitude || !longitude || !groupName)
            return response.status(400).send({
                message: 'Invalid parameters'
            });

        const chats = await client.getChats();
        const chat = chats.find(chat => chat.name === groupName && chat.id.server === 'g.us');
        if (!chat)
            return response.status(400).send({
                message: 'Group does not exist'
            });

        const location = new Location(latitude, longitude, message);
        await client.sendMessage(chat.id._serialized, location);
        return response.status(200).send({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error('Failed to send location in group', err);
        return response.status(500).send('Failed to send location in group');
    }
}

const GroupService = {
    sendMessage,
    sendMedia,
    sendLocation,
}

module.exports = GroupService;