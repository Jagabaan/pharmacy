
import { Cart } from '../model/cartModel.js';

export const resetCart = async (req, res) => {
  try {
    await Cart.deleteMany({}); 

    res.status(200).json({
      message: 'Cart has been reset successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
};
