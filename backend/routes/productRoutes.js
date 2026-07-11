import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);       // Uses the product ID in the URL
router.delete('/:id', deleteProduct);    // Uses the product ID in the URL

export default router;