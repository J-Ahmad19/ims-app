import db from '../config/db.js';

// Get all orders (Joining with CUSTOMERS to get the buyer's name)
export const getOrders = (req, res) => {
  const sql = `
    SELECT orders.id, orders.order_status, orders.total_amount, orders.created_at, customers.name AS customer_name 
    FROM orders 
    LEFT JOIN customers ON orders.customer_id = customers.id 
    ORDER BY orders.created_at DESC
  `;
  
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.status(200).json(data);
  });
};