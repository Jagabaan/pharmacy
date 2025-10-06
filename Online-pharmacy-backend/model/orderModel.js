import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      deliveryOptionId: {
        type: String,
        required: true,
        trim: true
      },
      estimatedDeliveryTimeMs: {
        type: Number,
        required: true
      },
      deliveryStatus: {
        type: String,
        enum: ['Preparing', 'Shipped', 'Delivered'],
        default: 'Preparing'
      }
    }
  ],
  totalCostCents: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
