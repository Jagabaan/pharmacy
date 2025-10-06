import { Cart } from '../model/cartModel.js';
import { DeliveryOption } from '../model/deliveryOptionModel.js';
import { Product } from '../model/productModel.js';

export const getPaymentSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ userId }).populate('productId');

    if (cartItems.length === 0) {
      return res.json({
        summary: {
          totalItems: 0,
          totalProductCost: 0,
          totalShippingCost: 0,
          totalOrderCost: 0
        }
      });
    }

    let totalItems = 0;
    let totalProductCost = 0;
    let totalShippingCost = 0;

    for (const item of cartItems) {
      totalItems += item.quantity;
      totalProductCost += item.productId.price * item.quantity;

      const deliveryOption = await DeliveryOption.findById(item.deliveryOptionId);
      if (deliveryOption) {
        totalShippingCost += deliveryOption.priceCents / 100;
      }
    }

    res.json({
      summary: {
        totalItems,
        totalProductCost,
        totalShippingCost,
        totalOrderCost: totalProductCost + totalShippingCost
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch payment summary',
      details: error.message
    });
  }
};
