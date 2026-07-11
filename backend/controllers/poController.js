import db from '../config/db.js';

// GET all Purchase Orders
export const getPOs = (req, res) => {
  const sql = `
    SELECT po.*, s.name as supplier_name, p.name as product_name, p.sku, w.code as warehouse_code 
    FROM purchase_orders po
    JOIN suppliers s ON po.supplier_id = s.id
    JOIN products p ON po.product_id = p.id
    JOIN warehouses w ON po.warehouse_id = w.id
    ORDER BY po.order_date DESC
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch POs" });
    res.status(200).json(data);
  });
};

// POST Create a new PO
export const createPO = (req, res) => {
  const { supplier_id, product_id, warehouse_id, quantity } = req.body;
  const sql = "INSERT INTO purchase_orders (supplier_id, product_id, warehouse_id, quantity, status) VALUES (?, ?, ?, ?, 'In-Transit')";
  
  db.query(sql, [supplier_id, product_id, warehouse_id, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to create PO" });
    res.status(201).json({ message: "PO created successfully" });
  });
};

// PUT Receive a PO (Updates status AND adds to inventory)
export const receivePO = (req, res) => {
  const { id } = req.params;
  
  // First, get the PO details
  db.query("SELECT * FROM purchase_orders WHERE id = ? AND status != 'Received'", [id], (err, pos) => {
    if (err || pos.length === 0) return res.status(400).json({ error: "PO not found or already received" });
    
    const po = pos[0];
    
    // 1. Update PO status
    db.query("UPDATE purchase_orders SET status = 'Received' WHERE id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ error: "Failed to update PO status" });

      // 2. Add inventory to stock_levels (Insert if new, Update if exists)
      const stockSql = `
        INSERT INTO stock_levels (product_id, warehouse_id, quantity) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `;
      
      db.query(stockSql, [po.product_id, po.warehouse_id, po.quantity], (err3) => {
        if (err3) return res.status(500).json({ error: "Failed to update stock levels" });
        res.status(200).json({ message: "Inventory successfully received and stock updated" });
      });
    });
  });
};