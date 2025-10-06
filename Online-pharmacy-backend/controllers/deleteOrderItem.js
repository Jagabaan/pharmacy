
import { Order } from '../model/orderModel.js';

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully',
      order: deletedOrder
    });
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
};
