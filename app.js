
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');
const apiRoutes = require('./routes/api');

const app = express();

// الاتصال بقاعدة البيانات
mongoose.connect(config.database.uri, config.database.options)
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// إعدادات التطبيق
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// المسارات
app.use('/api', apiRoutes);
app.get('/', (req, res) => res.render('dashboard'));

// الإشعارات الصوتية عبر Socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('مستخدم متصل');
  socket.on('disconnect', () => console.log('مستخدم غير متصل'));
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});

module.exports = { app, io };
