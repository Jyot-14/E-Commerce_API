import { Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Order } from '../database/entities/Order';
import { OrderDetail } from '../database/entities/OrderDetail';
import { Product } from '../database/entities/Product';

// For make an order
export const createOrder = async (req: any, res: Response) => {
  const { products, address } = req.body;

  const orderRepo = AppDataSource.getRepository(Order);
  const productRepo = AppDataSource.getRepository(Product);
  const orderDetailRepo = AppDataSource.getRepository(OrderDetail);

  try {
    const newOrder = new Order();
    newOrder.user = req.user_id;
    newOrder.total_amount = 0;
    newOrder.status = 'pending';
    newOrder.address = address;

    const savedOrder = await orderRepo.save(newOrder);

    let totalAmount = 0;

    for (const product of products) {
      const { product_id, quantities } = product;

      const productEntity = await productRepo.findOne({
        where: { product_id },
      });

      if (!productEntity) {
        throw new Error(`Product with ID ${product_id} not found`);
      }

      if (productEntity.quantity_available < quantities) {
        throw new Error(
          `Insufficient quantity for product with ID ${product_id}`
        );
      }

      const orderDetail = new OrderDetail();
      orderDetail.order = savedOrder;
      orderDetail.product = productEntity;
      orderDetail.quantities = quantities;

      await orderDetailRepo.save(orderDetail);

      totalAmount += productEntity.price * quantities;

      // Reduce product quantity
      productEntity.quantity_available -= quantities;
      await productRepo.save(productEntity);
    }

    savedOrder.total_amount = totalAmount;
    await orderRepo.save(savedOrder);

    return res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update the order status
export const updateOrderStatus = async (req: any, res: Response) => {
  const { order_id } = req.params;
  const { status } = req.body;

  const orderRepo = AppDataSource.getRepository(Order);

  try {
    const order = await orderRepo.findOne({ where: { order_id } });

    if (!order_id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order) {
      order.status = status;

      await orderRepo.save(order);

      return res.json({ message: 'Order status updated successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get the user's ordered products
interface OrderedProduct {
  order_id: number;
  order_date: Date;
  total_amount: number;
  product_id: number;
  title: string;
  price: number;
  quantities: number;
}
export const userOrderedProducts = async (req: any, res: Response) => {
  const orderRepo = AppDataSource.getRepository(Order);

  try {
    const userOrders = await orderRepo.find({
      where: { user: req.user_id },
      relations: ['orderDetails', 'orderDetails.product'],
    });

    const orderedProducts: OrderedProduct[] = [];

    for (const order of userOrders) {
      for (const orderDetail of order.orderDetails) {
        const product = orderDetail.product;

        if (product) {
          orderedProducts.push({
            order_id: order.order_id,
            order_date: order.order_date,
            total_amount: order.total_amount,
            product_id: product.product_id,
            title: product.title,
            price: product.price,
            quantities: orderDetail.quantities,
          });
        }
      }
    }

    return res.json({ orderedProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
