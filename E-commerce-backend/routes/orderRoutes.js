import express from 'express'
import { createOrder, getAllOrders, getOrderById } from '../controllers/orderController.js'

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

export default router;