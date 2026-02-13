import{ cart as Cart } from '../models/cart.js'
import{ Product } from '../models/product.js'

const getCart = async () => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [] });
    await cart.save();
  }
  return cart;
};

export const getCarts = async (req, res) => {
  try {
    const cart = await getCart();
    const populatedItems = await Promise.all(cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      return { ...item.toObject(), product };
    }));
    res.json({ items: populatedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity <= 0) return res.status(400).json({ message: 'Invalid input: productId and quantity > 0 required' });

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const cart = await getCart();
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ message: 'Items must be an array' });

  try {
    for (const item of items) {
      if (!item.productId || item.quantity <= 0) return res.status(400).json({ message: 'Invalid item' });
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
    }
    const cart = await getCart();
    cart.items = items;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await getCart();
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};