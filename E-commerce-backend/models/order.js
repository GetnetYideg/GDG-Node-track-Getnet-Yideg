import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  total: { type: Number, required: true },
  customerInfo: { type: Object, required: true }, 
  date: { type: Date, default: Date.now },
});

export const Order = mongoose.model('Order', orderSchema);