// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
// server/apps/middleware/protect.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const protect = (req, res, next) => {
  // ดึง token จาก Authorization header
  const authHeader = req.headers.authorization;

  // เช็คว่ามี header และขึ้นต้นด้วย Bearer หรือไม่
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  // แยก token ออกจาก Bearer
  const token = authHeader.split(' ')[1];

  try {
    // ตรวจสอบ token ว่าถูกต้องหรือไม่
    const decoded = jwt.verify(token, SECRET_KEY);

    // แนบข้อมูล user ไว้กับ req เผื่อใช้ใน controller ต่อไป
    req.user = decoded;

    // ผ่านแล้ว -> ไปยัง middleware ถัดไป
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

