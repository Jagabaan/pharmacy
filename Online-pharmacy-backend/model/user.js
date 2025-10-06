import mongoose from 'mongoose';

const safeRole = 'client';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
