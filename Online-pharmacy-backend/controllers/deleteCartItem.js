import { Cart } from "../model/cartModel.js";

export const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user.id; 

    const item = await Cart.findOneAndDelete({
      _id: cartItemId,
      userId
    });

    if (!item) {
      return res.status(404).json({ error: 'Cart item does not exist for this user' });
    }

    res.status(200).json({
      message: 'Cart item deleted successfully',
      cartItem: item
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
      action: 'Try again'
    });
  }
};
