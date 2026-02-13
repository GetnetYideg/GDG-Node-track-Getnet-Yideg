import { Order } from '../models/order.js';
import { Product } from '../models/product.js';

export const createOrder = async (req, res) => {
  const { customerInfo } = req.body;
  if (!customerInfo) return res.status(400).json({ message: 'Customer info required' });

  try {
    const cart = await getCart();
    if (cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let total = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      total += product.price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({ items: orderItems, total, customerInfo });
    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};