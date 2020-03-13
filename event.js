const { json } = require('micro');
const axios = require('axios');

const CHANNEL = process.env.CHANNEL || 'GQ565R7T8';

module.exports = async (req, res) => {
    const { event, challenge } = await json(req);

    if (challenge) {
        res.writeHead(200);
        return res.end(challenge);
    }

    if (event.subtype === 'add' && event.name && !event.name.includes('pepe')) {
        await axios({
            method: 'post',
            url: 'https://slack.com/api/chat.postMessage',
            headers: { 'Authorization': `Bearer ${process.env.SLACK_TOKEN}` },
            data: {
                channel: CHANNEL,
                text: `:surprisedpikachu: ` + `:${event.name}: `.repeat(5) + `:tada:`
            }
        });

        res.writeHead(200);
        return res.end();
    }

    if (event.subtype === 'remove' && event.names) {
        await axios({
            method: 'post',
            url: 'https://slack.com/api/chat.postMessage',
            headers: { 'Authorization': `Bearer ${process.env.SLACK_TOKEN}`},
            data: {
                channel: CHANNEL,
                text: event.names.map(name => `:x:` + ` ${name} ` + `:surprisedpikachu:`).join("\n")
            }
        });

        res.writeHead(200);
        return res.end();
    }

    res.writeHead(200);
    res.end();
};
