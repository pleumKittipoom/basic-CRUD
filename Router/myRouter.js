const express = require('express');
const router = express.Router();

const Product = require('../models/products');

// upload file
const multer = require('multer');

// กำหนดการตั้งค่า storage สำหรับ multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/products'); // ตำแหน่งจัดเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // เปลี่ยนชื่อไฟล์ให้ไม่ซ้ำกัน
    }
});

// สร้าง multer instance
const upload = multer({ storage: storage });

// ไปที่หน้าแรก
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // ใช้ await แทน callback
        res.render('index', { products: products });
    } catch (err) {
        console.error('Error retrieving products:', err);
        res.status(500).send('Error retrieving products');
    }
});

// ไปที่หน้า บันทึกสินค้า
router.get('/add-product', (req, res) => {
    res.render('form');
});

// ไปที่หน้า จัดการสินค้า
router.get('/manage', async (req, res) => {
    try {
        const products = await Product.find(); // ดึงสินค้าทั้งหมดจากฐานข้อมูล
        res.render('manage', { products: products }); // ส่งข้อมูลสินค้าไปยัง manage.ejs
    } catch (err) {
        console.error('Error retrieving products for manage page:', err);
        res.status(500).send('Error retrieving products');
    }
});

// ลบสินค้า
router.get('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id, { useFindAndModify: false }); // ลบสินค้าตาม id ที่ระบุ
        res.redirect('/manage'); // ลบเสร็จแล้วเด้งกลับไปยังหน้า manage
    } catch (err) {
        console.error('Error retrieving products for manage page:', err);
        res.status(500).send('Error retrieving products');
    }
});


// บันทึกสินค้า
router.post('/insert', upload.single('image'), async (req, res) => {
    console.log(req.file); // แสดงข้อมูลไฟล์ที่อัปโหลด
    let data = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.file.filename, // เก็บ path ของไฟล์ในฐานข้อมูล
        description: req.body.description
    });

    try {
        await Product.saveProduct(data); // เรียกฟังก์ชัน saveProduct เพื่อบันทึกข้อมูล
        res.redirect('/');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error saving product');
    }
});

// แก้ไขสินค้า
router.get('/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        console.log(product_id);

        const doc = await Product.findOne({ _id: product_id });
        console.log(doc);

        if (!doc) {
            return res.status(404).send('Product not found');
        }

        // ส่งข้อมูลไปยังหน้า render หรือทำตามต้องการ
        res.render('product', { product: doc });
    } catch (err) {
        console.error('Error edit product:', err);
        res.status(500).send('Error edit product');
    }
});

// แก้ไขสินค้า
router.post('/edit', async (req, res) => {
    try {
        const edit_id = req.body.edit_id;
        const doc = await Product.findOne({ _id: edit_id });
        console.log(doc);
        res.render('edit', { product: doc }); 
    }catch (err) {
        console.error('Error edit product:', err);
        res.status(500).send('Error edit product');
    }
});

// อัพเดทสินค้า
router.post('/update', async (req, res) => {
    // ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข
    const update_id = req.body.update_id;
    let data = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    };
    // อัพเดทข้อมูลใหม่ลงในฐานข้อมูล
    try {
        await Product.findByIdAndUpdate(update_id, data, { useFindAndModify: false });
         res.redirect('/manage');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error updating product');
    }
});


module.exports = router;
