import express from 'express';
import { filteredProduct } from '../controllers/filterController';

const router = express.Router();

router.post('/', filteredProduct);

export default router;
