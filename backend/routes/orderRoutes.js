import express from 'express';
import { getOrders, createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder); // Expose the new endpoint

export default router;