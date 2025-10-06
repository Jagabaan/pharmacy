import { Order } from '../model/orderModel.js';

export const getUserOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }

    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('products.productId');

    let totalRevenueCents = 0;

    const formattedOrders = orders.map(order => {
      const orderObj = order.toObject();
      totalRevenueCents += orderObj.totalCostCents;

      orderObj.totalCost = orderObj.totalCostCents / 100;

      orderObj.products = orderObj.products.map(item => {
        const product = { ...item };

        
        if (product.productId && typeof product.productId === 'object') {
          if (typeof product.productId.price === 'number') {
            product.productId.price = product.productId.price / 100;
          }
        } else {
          product.productId = {
            name: 'Product unavailable',
            imageUrl: '',
            price: 0
          };
        }

        return product;
      });

      return orderObj;
    });

    res.status(200).json({
      message: 'Orders fetched successfully',
      total: formattedOrders.length,
      totalRevenue: totalRevenueCents / 100,
      orders: formattedOrders
    });
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
};
