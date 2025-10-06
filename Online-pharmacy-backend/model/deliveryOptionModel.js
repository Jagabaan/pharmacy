import mongoose from 'mongoose';

const deliveryOptionSchema = new mongoose.Schema({
  deliveryDays: {
    type: Number,
    required: true,
    min: 1
  },
  priceCents: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

export const DeliveryOption = mongoose.model('DeliveryOption', deliveryOptionSchema);
