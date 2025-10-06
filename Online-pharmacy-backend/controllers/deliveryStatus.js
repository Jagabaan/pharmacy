import { Order } from '../model/orderModel.js';
import { Product } from '../model/productModel.js'; 

export const getDeliveryStatus = async (req, res) => {
  const { orderId, productId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const productInOrder = order.products.find(
      p => p.productId?.toString() === productId
    );

    if (!productInOrder) {
      return res.status(404).json({ error: 'Product not found in order' });
    }

    
    const productDetails = await Product.findById(productId);

    if (!productDetails) {
      return res.status(404).json({ error: 'Product details not found' });
    }

   
    res.json({
      name: productDetails.name,
      imageUrl: productDetails.imageUrl,
      quantity: productInOrder.quantity,
      estimatedDeliveryTimeMs: productInOrder.estimatedDeliveryTimeMs,
      deliveryStatus: productInOrder.deliveryStatus
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
