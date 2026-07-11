import db from '../config/db.js';

// GET: Fetch all orders
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

// POST: Create a new order AND dynamically reduce stock
export const createOrder = async (req, res) => {
  const { customer_id, items } = req.body;
  // Expected items format: [{ product_id: 1, warehouse_id: 1, quantity: 2, unit_price: 149.99 }]

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item." });
  }

  // 1. Calculate the Grand Total dynamically
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  // Get a promise-based connection for the Transaction
  const connection = db.promise();

  try {
    // Start Transaction
    await connection.query('BEGIN');

    // 2. Create the main Order (The Header)
    const [orderResult] = await connection.query(
      "INSERT INTO orders (customer_id, order_status, total_amount) VALUES (?, 'Completed', ?)",
      [customer_id, totalAmount]
    );
    const orderId = orderResult.insertId;

    // 3. Loop through the cart items
    for (const item of items) {
      // A. Insert into order_items
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, warehouse_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)",
        [orderId, item.product_id, item.warehouse_id, item.quantity, item.unit_price]
      );

      // B. Dynamically reduce the stock!
      const [stockUpdate] = await connection.query(
        "UPDATE stock_levels SET quantity = quantity - ? WHERE product_id = ? AND warehouse_id = ? AND quantity >= ?",
        [item.quantity, item.product_id, item.warehouse_id, item.quantity]
      );

      // Security Check: If affectedRows is 0, it means we didn't have enough stock!
      if (stockUpdate.affectedRows === 0) {
        throw new Error(`Insufficient stock for Product ID ${item.product_id} at Warehouse ID ${item.warehouse_id}`);
      }
    }

    // If everything succeeded, commit the changes permanently
    await connection.query('COMMIT');
    res.status(201).json({ message: "Order processed successfully and stock reduced!", orderId });

  } catch (err) {
    // If ANY step failed, rollback the entire transaction so nothing is saved
    await connection.query('ROLLBACK');
    console.error("Transaction failed:", err.message);
    res.status(400).json({ error: err.message });
  }
};