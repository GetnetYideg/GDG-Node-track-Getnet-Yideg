import { Product } from '../models/product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const query = {};
    if (category) query.category = category;
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;
  
  if (!name || price <= 0 || stock < 0) {
    return res.status(400).json({ message: 'Invalid input: name required, price > 0, stock >= 0' });
  }

  try {
    const product = new Product({ name, description, price, stock, category, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;
  if (name && name.trim() === '') return res.status(400).json({ message: 'Name cannot be empty' });
  if (price && price <= 0) return res.status(400).json({ message: 'Price must be positive' });
  if (stock && stock < 0) return res.status(400).json({ message: 'Stock cannot be negative' });
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, stock, category, imageUrl }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};