import { Cart } from "../model/cartModel.js";

export const updateCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { quantity, deliveryOptionId } = req.body;
    const userId = req.user.id; 

    
    const item = await Cart.findOne({ _id: cartItemId, userId });
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found for this user' });
    }

   
    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        return res.status(400).json({ error: 'Quantity must be a positive number' });
      }
      item.quantity = parsedQuantity;
    }

    
    if (deliveryOptionId) {
      item.deliveryOptionId = deliveryOptionId;
    }

    await item.save();

    res.status(200).json({ message: 'Cart item updated', cartItem: item });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
      action: 'Try again'
    });
  }
};
