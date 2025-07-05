const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const port = 3000;

// استبدل هذا بالتوكن الجديد من @BotFather
const token = '7854414810:AAGyuC8sZ-zHLOdNHl81GScSPYsCOesNok8'; 
const bot = new TelegramBot(token, { polling: true });

// كلمة سر للتحكم في API
const API_SECRET = "MY_STRONG_SECRET";

let shouldRedirect = false;

// Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API للتحقق من التوجيه
app.get('/api/check-redirect', (req, res) => {
    res.json({
        redirect: shouldRedirect,
        redirectUrl: 'traitement.html'
    });
});

// API محمي بكلمة سر
app.get('/api/trigger-redirect', (req, res) => {
    if (req.query.secret !== API_SECRET) {
        return res.status(403).send("غير مسموح!");
    }
    shouldRedirect = true;
    res.send('✅ تم التوجيه!');
});

// أمر البوت مع التحقق
bot.onText(/\/redirect/, (msg) => {
    const chatId = msg.chat.id;
    const apiUrl = `http://your-server.com/api/trigger-redirect?secret=${API_SECRET}`;

    bot.sendMessage(chatId, "جاري التوجيه...")
        .then(() => fetch(apiUrl))
        .then(() => bot.sendMessage(chatId, '🚀 تم التوجيه!'))
        .catch(() => bot.sendMessage(chatId, '❌ فشل في التوجيه!'));
});

app.listen(port, () => {
    console.log(`✅ الخادم يعمل على http://localhost:${port}`);
});
