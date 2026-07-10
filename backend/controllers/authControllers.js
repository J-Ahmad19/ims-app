import bcrypt from 'bcrypt';
import db from '../config/db.js';

// Signup Logic
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      try {
        if (err) {
          if(err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Email already exists" });
          }
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
      } catch (innerError) {
        res.status(500).json({ error: "Error processing database response" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// Login Logic
export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, data) => {
      try {
        if (err) return res.status(500).json({ error: "Database error" });
        if (data.length === 0) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, data[0].password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        res.status(200).json({ message: "Login successful", user: { name: data[0].name, email: data[0].email } });
      } catch (innerError) {
        res.status(500).json({ error: "Error processing login response" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
};