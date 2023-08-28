import express from 'express';
import {
  createOrder,
  updateOrderStatus,
  userOrderedProducts,
} from '../controllers/orderController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, createOrder);

router.get('/usersOrder', verifyToken, userOrderedProducts);

router.put('/:order_id/status', updateOrderStatus);

export default router;
