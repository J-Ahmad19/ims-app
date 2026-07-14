import db from './db.js';

const initializeDatabase = async () => {
  // Use the promise wrapper for async/await support
  const connection = db.promise();

  console.info("⏳ Starting database initialization...");

  try {
    // 1. Turn off foreign key checks temporarily so we don't get blocked during creation
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 2. Define all tables in the correct order (Parents first, Children next)
    // Using IF NOT EXISTS ensures we don't accidentally overwrite existing data
    const tables = [
      // --- INDEPENDENT TABLES ---
      `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE IF NOT EXISTS customers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          sku VARCHAR(50) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE IF NOT EXISTS warehouses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(20) NOT NULL UNIQUE,
          name VARCHAR(100) NOT NULL,
          location VARCHAR(255),
          capacity_percentage DECIMAL(5,2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE IF NOT EXISTS suppliers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          contact_email VARCHAR(100),
          phone VARCHAR(20),
          lead_time_days INT DEFAULT 0,
          rating DECIMAL(3,1) DEFAULT 0.0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // --- DEPENDENT TABLES ---
      `CREATE TABLE IF NOT EXISTS stock_levels (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          warehouse_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 0,
          low_stock_threshold INT DEFAULT 10,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );`,
      
      `CREATE TABLE IF NOT EXISTS purchase_orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          supplier_id INT NOT NULL,
          product_id INT NOT NULL,
          warehouse_id INT NOT NULL,
          quantity INT NOT NULL,
          status VARCHAR(50) DEFAULT 'Pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
      );`,
      
      `CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customer_id INT,
          order_status VARCHAR(50) DEFAULT 'Pending',
          total_amount DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
      );`,
      
      `CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          warehouse_id INT NOT NULL,
          quantity INT NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL, 
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id),
          FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
      );`
    ];

    // 3. Execute all queries sequentially
    for (let i = 0; i < tables.length; i++) {
      await connection.query(tables[i]);
      console.info(`✅ Table ${i + 1}/${tables.length} verified/created.`);
    }

    // 4. Turn strict checks back on
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.info("🎉 Database schema initialized successfully!");
    process.exit(0); // Exit the script successfully

  } catch (error) {
    console.error("❌ Failed to initialize database:", error.message);
    process.exit(1); // Exit with error code
  }
};

// Run the function
initializeDatabase();