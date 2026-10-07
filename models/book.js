const mongoose = require('mongoose');
const { readConn, writeConn } = require('../config/db');

const schema = new mongoose.Schema({
    maSP: { type: String, required: true },
    tenSach: { type: String, required: true },
    tacGia: { type: String, default: '' },
    giaGoc: { type: Number, required: true },
    vat: { type: Number, required: true },
    giaSauThue: { type: Number, required: true },
}, { timestamps: true, collection: 'books' });

// Cùng một schema nhưng gắn vào 2 connection khác nhau
module.exports = {
    BookRead: readConn.model('Book', schema),   // chỉ dùng find
    BookWrite: writeConn.model('Book', schema),  // chỉ dùng create
};