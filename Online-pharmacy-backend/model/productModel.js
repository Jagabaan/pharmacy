
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number, // price in Kobo (e.g., ₦9000 = 900000)
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  epirationDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Expiration date must be in the future.'
    }
  },
    imageUrl: {
        type: String,
        required: true
    },
    public_id: {type: String,
        required: true},
  keywords: {
    type: [String],
    required: true
  }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);

