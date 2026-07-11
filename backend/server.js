import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';

dotenv.config();

const app = express();

try {
  // Middleware
  const corsOptions = { origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true };
  app.use(cors(corsOptions));
  app.use(express.json());

  // Mount Routes
  app.use('/', authRoutes);
  app.use('/products', productRoutes);
  app.use('/orders', orderRoutes);
  app.use('/warehouses', warehouseRoutes);

  // Start Server
  const PORT = process.env.PORT; 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

} catch (globalError) {
  console.error("Failed to start server:", globalError);
}

