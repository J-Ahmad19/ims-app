import db from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Use the promise wrapper for clean async/await syntax
    const connection = db.promise();

    // Run all queries simultaneously for maximum performance
    const [
      [[{ total_value }]], 
      [[{ total_skus }]], 
      [[{ active_orders }]], 
      [low_stock_items],
      [warehouses],
      [distribution]
    ] = await Promise.all([
      // 1. Total Inventory Value
      connection.query(`SELECT SUM(sl.quantity * p.price) as total_value FROM stock_levels sl JOIN products p ON sl.product_id = p.id`),
      // 2. Total Catalog Items
      connection.query(`SELECT COUNT(*) as total_skus FROM products`),
      // 3. Active Orders (Pending or Processing)
      connection.query(`SELECT COUNT(*) as active_orders FROM orders WHERE order_status IN ('Pending', 'Processing')`),
      // 4. Low Stock Alerts (Items at or below threshold)
      connection.query(`SELECT p.name, sl.quantity FROM stock_levels sl JOIN products p ON sl.product_id = p.id WHERE sl.quantity <= sl.low_stock_threshold LIMIT 5`),
      // 5. Warehouse Capacities
      connection.query(`SELECT code, name, capacity_percentage FROM warehouses ORDER BY capacity_percentage DESC`),
      // 6. Inventory Distribution for Pie Chart
      connection.query(`SELECT w.code, SUM(sl.quantity) as total_items FROM stock_levels sl JOIN warehouses w ON sl.warehouse_id = w.id GROUP BY w.id`)
    ]);

    // Format the response for the frontend
    res.status(200).json({
      stats: {
        totalValue: total_value || 0,
        totalSKUs: total_skus || 0,
        activeOrders: active_orders || 0,
        lowStockCount: low_stock_items.length
      },
      warehouses: warehouses,
      distribution: distribution,
      alerts: low_stock_items.map(item => ({
        title: `Low Stock: ${item.name} (${item.quantity} left)`,
        type: 'warning'
      }))
    });

  } catch (err) {
    console.error("Dashboard calculation failed:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};