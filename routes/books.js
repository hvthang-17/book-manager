const router = require('express').Router();
const { BookRead, BookWrite } = require('../models/book');
const S = require('../config/student');

// Lấy danh sách bằng tài khoản ĐỌC rồi render trang
async function renderHome(req, res, { status = 200, error = null, form = {} } = {}) {
    console.log('[READ ] find books bằng tài khoản đọc');
    const books = await BookRead.find().sort({ createdAt: -1 }).lean();
    res.status(status).render('home', {
        books,
        error,
        form,
        sessionViews: req.session ? req.session.views : undefined,
        ...S, // HO_TEN, MSSV, PREFIX, VAT cho form và footer
    });
}

// Xem danh sách -> luồng ĐỌC
router.get('/', async (req, res) => {
    try {
        await renderHome(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).send('Lỗi đọc dữ liệu');
    }
});

// Thêm mới -> luồng GHI
router.post('/books', async (req, res) => {
    try {
        const maSP = (req.body.maSP || '').trim();
        const tenSach = (req.body.tenSach || '').trim();
        const tacGia = (req.body.tacGia || '').trim();
        const giaGoc = Number(req.body.giaGoc);
        const form = { maSP, tenSach, tacGia, giaGoc: req.body.giaGoc };

        // Bộ lọc cá nhân hóa: mã SP phải bắt đầu bằng 3 số cuối MSSV
        if (!maSP.startsWith(S.PREFIX)) {
            return renderHome(req, res, {
                status: 400, form,
                error: `Từ chối: mã sản phẩm phải bắt đầu bằng "${S.PREFIX}".`,
            });
        }

        if (!tenSach || !(giaGoc > 0)) {
            return renderHome(req, res, {
                status: 400, form,
                error: 'Từ chối: tên sách bắt buộc và giá gốc phải lớn hơn 0.',
            });
        }

        // VAT động: (chữ số cuối MSSV + 6)% -> 10%
        const giaSauThue = Math.round((giaGoc * (100 + S.VAT)) / 100);

        console.log('[WRITE] create book bằng tài khoản ghi');
        await BookWrite.create({ maSP, tenSach, tacGia, giaGoc, vat: S.VAT, giaSauThue });
        res.redirect('/');
    } catch (e) {
        console.error(e);
        res.status(500).send('Lỗi ghi dữ liệu');
    }
});

module.exports = router;