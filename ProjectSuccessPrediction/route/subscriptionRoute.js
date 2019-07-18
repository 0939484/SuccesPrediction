const express = require('express');
const router = express.Router();
const webPush = require('web-push');

const {publicKey, privateKey} = require('../configure');

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

app.post('/', (req, res) => {
    const subscription = req.body;

    res.status(201).json({});

    const payload = JSON.stringify({
        title: 'Push notifications with Service Workers',
    });

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
});

module.exports = router;