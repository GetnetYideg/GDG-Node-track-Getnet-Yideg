import express from 'express'
import { getCarts, addToCart, updateCart, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCarts);
router.post('/', addToCart);
router.put('/', updateCart);
router.delete('/:productId', removeFromCart);

export default router;