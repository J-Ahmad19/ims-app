import db from '../config/db.js';

// Get all orders (Joining with users to get the customer name)
export const getOrders = (req, res) => {
  const sql = `
    SELECT orders.id, orders.order_status, orders.total_amount, orders.created_at, users.name AS customer_name 
    FROM orders 
    LEFT JOIN users ON orders.user_id = users.id 
    ORDER BY orders.created_at DESC
  `;
  
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.status(200).json(data);
  });
};