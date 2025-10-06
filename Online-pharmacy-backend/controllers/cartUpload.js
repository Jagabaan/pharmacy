import { Cart } from '../model/cartModel.js';
import { Product } from '../model/productModel.js';
import { DeliveryOption } from '../model/deliveryOptionModel.js';

export const cartUpload = async function (req, res) {
  try {
    const userId = req.user.id; 
    let { productId, quantity } = req.body;
    quantity = parseInt(quantity);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const defaultDeliveryOption = await DeliveryOption.findOne();
    if (!defaultDeliveryOption) {
      return res.status(500).json({ error: 'No delivery option available. Cannot add to cart.' });
    }

    const deliveryOptionId = defaultDeliveryOption._id.toString();

    
    let existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      await Cart.create({
        userId,
        productId,
        quantity,
        deliveryOptionId
      });
    }

    const userCart = await Cart.find({ userId }).populate('productId');

    res.status(201).json({
      message: 'Cart updated successfully',
      cart: userCart
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message,
      action: 'Please try again'
    });
  }
};
