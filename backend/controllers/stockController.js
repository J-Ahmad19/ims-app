import db from '../config/db.js';

// GET: Fetch all live stock levels with joined product and warehouse data
export const getStockLevels = (req, res) => {
  // Observability: Start request timer
  const startTime = Date.now();
  console.info(`[INFO] ${new Date().toISOString()} - GET /stock - Request received from ${req.ip}`);

  const sql = `
      SELECT 
          p.id AS product_id,
          p.sku, 
          p.name AS product_name, 
          IFNULL(sl.quantity, 0) AS quantity, 
          IFNULL(sl.low_stock_threshold, 10) AS low_stock_threshold,
          IFNULL(w.code, 'No Location') AS warehouse_code
      FROM products p
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      LEFT JOIN warehouses w ON sl.warehouse_id = w.id
      ORDER BY quantity ASC;
    `;

  db.query(sql, (err, data) => {
    const duration = Date.now() - startTime;
    
    if (err) {
      // Observability: Log failure with exact duration and error message
      console.error(`[ERROR] ${new Date().toISOString()} - GET /stock - Failed after ${duration}ms:`, err.message);
      return res.status(500).json({ error: "Failed to fetch stock levels" });
    }

    // Observability: Log success with performance metrics
    console.info(`[INFO] ${new Date().toISOString()} - GET /stock - Success (${data.length} records) in ${duration}ms`);
    res.status(200).json(data);
  });
};