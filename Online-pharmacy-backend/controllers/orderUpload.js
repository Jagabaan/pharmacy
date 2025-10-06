import { Order } from '../model/orderModel.js';
import { Product } from '../model/productModel.js';
import { DeliveryOption } from '../model/deliveryOptionModel.js';
import { Cart } from '../model/cartModel.js';

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    let totalCostCents = 0;
    const productItems = [];

    for (const item of products) {
      const {
        productId,
        quantity,
        deliveryOptionId,
        estimatedDeliveryTimeMs
      } = item;

      if (!productId || quantity < 1 || !deliveryOptionId || !estimatedDeliveryTimeMs) {
        return res.status(400).json({
          error: 'Each product must include productId, quantity, deliveryOptionId, and estimatedDeliveryTimeMs'
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` });
      }

      const deliveryOption = await DeliveryOption.findById(deliveryOptionId);
      if (!deliveryOption) {
        return res.status(400).json({ error: `Invalid delivery option ID: ${deliveryOptionId}` });
      }

      totalCostCents += product.price * quantity * 100;
      totalCostCents += deliveryOption.priceCents;

      productItems.push({
        productId,
        quantity,
        deliveryOptionId,
        estimatedDeliveryTimeMs
      });
    }

   
    const order = await Order.create({
      userId: req.user.id,
      products: productItems,
      totalCostCents
    });

    const populatedOrder = await Order.findById(order._id).populate('products.productId');

    
    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json({
      message: 'Order created successfully',
      totalCost: totalCostCents / 100,
      order: populatedOrder
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
};
