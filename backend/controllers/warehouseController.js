import db from '../config/db.js';

// GET: Fetch all warehouses
export const getWarehouses = (req, res) => {
  const sql = "SELECT * FROM warehouses ORDER BY code ASC";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch warehouses" });
    res.status(200).json(data);
  });
};

// POST: Add a new warehouse
export const addWarehouse = (req, res) => {
  const { code, name, location, capacity_percentage } = req.body;
  const sql = "INSERT INTO warehouses (code, name, location, capacity_percentage) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [code, name, location, capacity_percentage || 0], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Warehouse Code already exists!" });
      return res.status(500).json({ error: "Failed to add warehouse" });
    }
    res.status(201).json({ message: "Warehouse added successfully", id: result.insertId });
  });
};

// PUT: Update a warehouse
export const updateWarehouse = (req, res) => {
  const { id } = req.params;
  const { code, name, location, capacity_percentage } = req.body;
  const sql = "UPDATE warehouses SET code = ?, name = ?, location = ?, capacity_percentage = ? WHERE id = ?";
  
  db.query(sql, [code, name, location, capacity_percentage, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Warehouse Code already exists!" });
      return res.status(500).json({ error: "Failed to update warehouse" });
    }
    res.status(200).json({ message: "Warehouse updated successfully" });
  });
};

// DELETE: Remove a warehouse
export const deleteWarehouse = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM warehouses WHERE id = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete warehouse" });
    res.status(200).json({ message: "Warehouse deleted successfully" });
  });
};