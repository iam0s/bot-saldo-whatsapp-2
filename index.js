console.log("BOT INICIANDO...");

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({ auth: state });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    if (update.qr) {
      qrcode.generate(update.qr, { small: true });
    }

    if (update.connection === 'open') {
      console.log('BOT CONECTADO COM SUCESSO');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const texto =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!texto) return;

    if (texto.includes(' ')) {
      const [id, valor] = texto.split(' ');

      const gerente = '85517831622@s.whatsapp.net';

      await sock.sendMessage(gerente, {
        text: `📥 NOVO PEDIDO\nID: ${id}\nVALOR: ${valor}`
      });
    }
  });
}

startBot();
