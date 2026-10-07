const MSSV = '23IT254';

module.exports = {
    HO_TEN: 'Hoàng Văn Thắng',
    MSSV,
    PREFIX: MSSV.slice(-3),                     // 3 số cuối → "254"
    VAT: parseInt(MSSV.slice(-1), 10) + 6,      // chữ số cuối (4) + 6 → 10
};