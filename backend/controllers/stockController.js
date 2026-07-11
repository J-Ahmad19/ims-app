import db from '../config/db.js';

// GET: Fetch all live stock levels with joined product and warehouse data
export const getStockLevels = (req, res) => {
  // Observability: Start request timer
  const startTime = Date.now();
  console.info(`[INFO] ${new Date().toISOString()} - GET /stock - Request received from ${req.ip}`);

  const sql = `
    SELECT 
        sl.id, 
        sl.quantity, 
        sl.low_stock_threshold, 
        sl.last_updated,
        p.sku, 
        p.name AS product_name, 
        w.code AS warehouse_code
    FROM stock_levels sl
    JOIN products p ON sl.product_id = p.id
    JOIN warehouses w ON sl.warehouse_id = w.id
    ORDER BY (sl.quantity / sl.low_stock_threshold) ASC;
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