const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: Mbuvi_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    async function supreme_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let supreme = Mbuvi_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });

            if (!supreme.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await supreme.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            supreme.ev.on('creds.update', saveCreds);
            supreme.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                   await supreme.groupAcceptInvite('BsmJiEZMlBT5C2TKN6Wnmf');
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(6000);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await supreme.sendMessage(supreme.user.id, { text: 'trashcore~' + b64data });

                    let supreme_TEXT = `
        
╔════════════════════
║ ◇SESSION CONNECTED◇
║ 🔹 BOT: JUNE-MD
║ 🌀 TYPE: BASE64
║ 🔹 OWNER: Supreme
╚════════════════════
`;

                    await supreme.sendMessage(supreme.user.id, { text: supreme_TEXT }, { quoted: session });

                    await delay(100);
                    await supreme.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    supreme_CODE();
                }
            });
        } catch (err) {
            console.log('Service restarted');
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }
    
    return await supreme_CODE();
});

module.exports = router;
