import express from 'express';
import {
  filteredProduct,
  getFilterOptions,
} from '../controllers/filterController';

const router = express.Router();

router.post('/', filteredProduct);

router.get('/filter-options', getFilterOptions);

export default router;
