const mongoose = require('mongoose');

// 2 tài khoản không có quyền createIndex/createCollection, nên tắt tự tạo
const opts = { autoIndex: false, autoCreate: false };

const readConn = mongoose.createConnection(process.env.MONGO_URI_READ, opts);
const writeConn = mongoose.createConnection(process.env.MONGO_URI_WRITE, opts);

readConn.on('connected', () => console.log('[DB] Kết nối ĐỌC thành công'));
writeConn.on('connected', () => console.log('[DB] Kết nối GHI thành công'));
readConn.on('error', (e) => console.error('[DB] Lỗi kết nối ĐỌC:', e.message));
writeConn.on('error', (e) => console.error('[DB] Lỗi kết nối GHI:', e.message));

module.exports = { readConn, writeConn };