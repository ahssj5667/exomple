const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const path = require('path');

// إعداد Express
const app = express();
const port = 3000;

// إعداد Telegram Bot (ضع التوكن هنا)
const token = '7854414810:AAGyuC8sZ-zHLOdNHl81GScSPYsCOesNok8'; // ⚠️ استبدل هذا بـ Token الخاص بك
const bot = new TelegramBot(token, { polling: true });

// كلمة سر للتحكم في API
const API_SECRET = "MY_STRONG_SECRET123";

// متغيرات التوجيه
let shouldRedirect = false;
const TARGET_PAGE = 'https://ahssj5667.github.io/exomple/traitement.html'; // الصفحة الهدف

// Middleware لخدمة الملفات الثابتة
app.use(express.static('public'));

// صفحة الانتظار (Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API للتحقق من التوجيه
app.get('/api/check-redirect', (req, res) => {
    res.json({
        redirect: shouldRedirect,
        redirectUrl: TARGET_PAGE
    });
});

// API محمي بكلمة سر
app.get('/api/trigger-redirect', (req, res) => {
    if (req.query.secret !== API_SECRET) {
        return res.status(403).send("غير مسموح!");
    }
    shouldRedirect = true;
    res.send('✅ تم تفعيل التوجيه!');
});

// Telegram Bot Command
bot.onText(/\/redirect/, (msg) => {
    const chatId = msg.chat.id;
    const apiUrl = `http://localhost:3000/api/trigger-redirect?secret=${API_SECRET}`;

    bot.sendMessage(chatId, "جاري التوجيه...")
        .then(() => axios.get(apiUrl))
        .then(() => bot.sendMessage(chatId, '🚀 تم توجيه المستخدم إلى الصفحة التالية!'))
        .catch((err) => {
            console.error(err);
            bot.sendMessage(chatId, '❌ فشل في التوجيه! تأكد من تشغيل الخادم.');
        });
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`✅ الخادم يعمل على http://localhost:${port}`);
    console.log(`📌 الصفحة الهدف: ${TARGET_PAGE}`);
});
