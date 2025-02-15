const mongoose = require('mongoose');

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://127.0.0.1:27017/productDB';
mongoose.connect(dbUrl).catch(err => console.log(err));

// ออกแบบ Schema
let productSchema = mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String
});

// สร้าง Model จาก Schema ที่ออกแบบไว้
let Product = mongoose.model("product", productSchema);

// ส่งออก Model นี้เพื่อใช้งานในภายนอก 
module.exports = Product;

// ฟังก์ชันสำหรับบันทึกข้อมูลสินค้า
module.exports.saveProduct = async function(model,data) {
    try {
        await model.save(data);
        console.log("Product saved successfully");
    } catch (err) {
        console.error("Error saving product:", err);
        throw err;
    }
};
