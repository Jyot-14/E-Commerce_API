import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import filterRoutes from './routes/filterRoutes';

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/filter', filterRoutes);

app.use('*', (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'Invalid route',
  });
});

export default app;
