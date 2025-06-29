const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
const apiKey = process.env.AUTHENTICATION_API_KEY || 'default';

app.use(express.json());

const client = new Client();

client.on('qr', qr => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

app.post('/message/sendWhatsappText/default', (req, res) => {
    const headersApiKey = req.headers['apikey'];
    if (headersApiKey !== apiKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { number, text } = req.body;

    if (!number || !text) {
        return res.status(400).json({ error: 'Missing number or text' });
    }

    client.sendMessage(number + '@c.us', text)
        .then(response => res.json({ success: true, response }))
        .catch(err => res.status(500).json({ error: err.toString() }));
});

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});