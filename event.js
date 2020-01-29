const { json } = require('micro');
const axios = require('axios');

const CHANNEL = process.env.CHANNEL || 'GQ565R7T8';

module.exports = async (req, res) => {
    const { event: {subtype, name, names} } = await json(req);

    if (subtype === 'add' && name) {
        await axios({
            method: 'post',
            url: 'https://slack.com/api/chat.postMessage',
            headers: {'Authorization': `Bearer ${process.env.SLACK_TOKEN}`},
            data: {
                channel: CHANNEL,
                text: `:alert:` + `:${name}: `.repeat(5) + `:alert:`
            }
        });

        res.writeHead(200);
        return res.end();
    }

    if (subtype === 'remove' && names) {
        await axios({
            method: 'post',
            url: 'https://slack.com/api/chat.postMessage',
            headers: {'Authorization': `Bearer ${process.env.SLACK_TOKEN}`},
            data: {
                channel: CHANNEL,
                text: names.map(name => `:alert-blue:` + `:${name}: `.repeat(5) + `:alert-blue:`).join("\n")
            }
        });

        res.writeHead(200);
        return res.end();
    }

    res.writeHead(200);
    res.end();
};
