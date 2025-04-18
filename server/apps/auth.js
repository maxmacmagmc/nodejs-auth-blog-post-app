import { Router } from "express";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
const authRouter = Router();
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "practice-mongo";
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        if (!username || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection("users");
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = {
            username,
            password: hashedPassword,
            firstName,
            lastName,
        };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }finally {
        await client.close();
    }
}
);

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
      }
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const payload ={
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
      res.json({message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    finally {
        await client.close();
    }
  }
);

export default authRouter;
