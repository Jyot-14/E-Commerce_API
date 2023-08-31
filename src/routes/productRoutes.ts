import express from 'express';
import {
  getCategories,
  getProductsWithFilters,
  searchProduct,
} from '../controllers/productController';

const router = express.Router();

router.get('/search', searchProduct);
router.get('/filter', getProductsWithFilters);
router.get('/categories', getCategories);

export default router;
