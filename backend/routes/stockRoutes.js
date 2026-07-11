import express from 'express';
import { getStockLevels } from '../controllers/stockController.js';

const router = express.Router();

router.get('/', getStockLevels);

export default router;