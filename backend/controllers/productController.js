import db from '../config/db.js';

// GET: Fetch all products
export const getProducts = (req, res) => {
  const sql = "SELECT * FROM products ORDER BY created_at DESC";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.status(200).json(data);
  });
};

// POST: Add a new product
export const addProduct = (req, res) => {
  const { sku, name, price } = req.body;
  const sql = "INSERT INTO products (sku, name, price) VALUES (?, ?, ?)";
  
  db.query(sql, [sku, name, price], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "SKU already exists!" });
      return res.status(500).json({ error: "Failed to add product" });
    }
    res.status(201).json({ message: "Product added successfully", id: result.insertId });
  });
};

// PUT: Update an existing product
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { sku, name, price } = req.body;
  const sql = "UPDATE products SET sku = ?, name = ?, price = ? WHERE id = ?";
  
  db.query(sql, [sku, name, price, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "SKU already exists!" });
      return res.status(500).json({ error: "Failed to update product" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  });
};

// DELETE: Remove a product
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete product" });
    res.status(200).json({ message: "Product deleted successfully" });
  });
};