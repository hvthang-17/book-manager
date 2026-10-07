require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.MongoStore || connectMongo.default || connectMongo;
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

// SESSION STATELESS: lưu tập trung xuống MongoDB Atlas 
const isProd = process.env.NODE_ENV === 'production';
if (isProd) app.set('trust proxy', 1); // Render đứng sau proxy HTTPS

// Connection riêng cho session store, dùng tài khoản GHI
const sessionClient = mongoose
    .createConnection(process.env.MONGO_URI_WRITE, { autoIndex: false, autoCreate: false })
    .asPromise()
    .then((c) => c.getClient());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        clientPromise: sessionClient,
        dbName: 'DB_23IT254',
        collectionName: 'sessions',
        autoRemove: 'interval',     // dọn session hết hạn bằng deleteMany (không cần quyền createIndex)
        autoRemoveInterval: 10,     // phút
    }),
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60,     // 1 giờ
    },
}));

// Bộ đếm lượt truy cập trong phiên (chứng minh session lưu trên Atlas)
app.use((req, res, next) => {
    req.session.views = (req.session.views || 0) + 1;
    res.locals.sessionViews = req.session.views;
    next();
});

app.use('/', require('./routes/books'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server chạy cổng', PORT));