import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryOption',
    required: true
  }
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartItemSchema);
