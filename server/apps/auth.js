import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    if (!user.username || !user.password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const existingUser = await db.collection("users").findOne({ username: user.username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const collection = db.collection("users");
    await collection.insertOne(user);
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.collection("users").findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.SECRET_KEY || "default_secret_key",
            { expiresIn: "600000" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
          
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    
    }
});


export default authRouter;
