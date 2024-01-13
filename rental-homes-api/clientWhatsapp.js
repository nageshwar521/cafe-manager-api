const fs = require('fs');
const path = require('path');
const qrCode = require('qrcode');
const pkg = require("whatsapp-web.js");
const {PassThrough} = require('stream');

const myGroupName = "Test group";

const pathQr = path.resolve('last.qr');
console.log(pathQr);

const { Client, LocalAuth } = pkg;

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--unhandled-rejections=strict'] }
// });

// const client = new Client({
//     puppeteer: { headless: false }, // Make headless true or remove to run browser in background
//     session: sessionCfg,
// });

const client = new Client({
  puppeteer: { headless: false }, // Make headless true or remove to run browser in background
  authStrategy: new LocalAuth({
    clientId: "client-one"
  }),
});

client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    fs.writeFileSync(pathQr, qr);
});

client.on("authenticated", () => {
    console.log("AUTH!");
    try {
        fs.unlinkSync(pathQr);
    } catch (err) { }
});

client.on("auth_failure", (msg) => {
    console.error('AUTHENTICATION FAILURE', msg);
    process.exit();
});

client.on("disconnected", () => {
    console.log("disconnected");
});

client.on("ready", () => {
    // console.log("Client is ready!");
    // console.log(client);
    client.getChats().then((chats) => {
      const myGroup = chats.find((chat) => chat.name === myGroupName);
      const groupMembers = myGroup.participants;
      console.log(groupMembers, 'participants');
      
    });
});

client.on("message", async (message) => {
    console.log(await message?.getInfo());
    const content = getMessage();
    // await message.reply("What is your requiremnet?");
});

const getMessage = () => {
  const productsList = new pkg.List(
    "Here's our list of products at 50% off",
    "View all products",
    [
      {
        title: "Products list",
        rows: [
          { id: "apple", title: "Apple" },
          { id: "mango", title: "Mango" },
          { id: "banana", title: "Banana" },
        ],
      },
    ],
    "Please select a product"
  );
  return productsList;
}

module.exports = client;