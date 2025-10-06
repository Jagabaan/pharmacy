import { Cart } from "../model/cartModel.js";

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; 
    const cartItems = await Cart.find({ userId }).populate('productId');
    
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
      action: 'Try again'
    });
  }
};

