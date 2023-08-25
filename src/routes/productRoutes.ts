import express from 'express';
import {
  getProductsWithFilters,
  searchProduct,
} from '../controllers/productController';

const router = express.Router();

router.get('/search', searchProduct);
router.get('/filter', getProductsWithFilters);

export default router;
