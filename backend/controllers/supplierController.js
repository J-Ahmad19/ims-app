import db from '../config/db.js';

export const getSuppliers = (req, res) => {
  const sql = "SELECT * FROM suppliers ORDER BY name ASC";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch suppliers" });
    res.status(200).json(data);
  });
};

export const addSupplier = (req, res) => {
  const { name, contact_email, phone, lead_time_days } = req.body;
  const sql = "INSERT INTO suppliers (name, contact_email, phone, lead_time_days) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [name, contact_email, phone, lead_time_days || 0], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add supplier" });
    res.status(201).json({ message: "Supplier added successfully" });
  });
};