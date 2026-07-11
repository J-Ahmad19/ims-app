import db from '../config/db.js';

export const getCustomers = (req, res) => {
  db.query("SELECT * FROM customers ORDER BY name ASC", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch customers" });
    res.status(200).json(data);
  });
};