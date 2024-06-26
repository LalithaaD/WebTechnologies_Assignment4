//Dependencies
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Route to get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to get a single product by ID
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});

// Route to create a new product
router.post('/', async (req, res) => {
    const product = new Product({
        description: req.body.description,
        image: req.body.image,
        pricing: req.body.pricing,
        shippingCost: req.body.shippingCost
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to update a product by ID
router.put('/:id', getProduct, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to delete a product by ID
router.delete('/:id', getProduct, async (req, res) => {
    try {
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get product by ID
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.product = product;
    next();
}

module.exports = router;
