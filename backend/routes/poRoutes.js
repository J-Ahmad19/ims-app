import express from 'express';
import { getPOs, createPO, receivePO } from '../controllers/poController.js';
const router = express.Router();
router.get('/', getPOs);
router.post('/', createPO);
router.put('/:id/receive', receivePO); // Endpoint to trigger the receiving process
export default router;