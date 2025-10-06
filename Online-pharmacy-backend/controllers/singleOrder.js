import { Order } from '../model/orderModel.js';

export const singleOrder = async (req, res) => {
  try {
    const  orderId  = req.params.id ;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await Order.findById(orderId).populate('products.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      order
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
}