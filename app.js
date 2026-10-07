require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/books'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server chạy cổng', PORT));