import { Router } from 'express';

import ProductManager from '../productManager.js';

const router = Router();

router.get('/products/', async (req, res) => {
    const { query } = req;
    const { limit } = query;

    const product1 = new ProductManager('productos.json');
    console.log(product1);
    const products = await product1.getProducts();
    if (!limit) {
        res.json(products);
    } else {
        console.log(limit);
        const limitProducts = products.slice(0, parseInt(limit));
        res.json(limitProducts);
    }
});

router.get('/products/:pid/', async (req, res) => {
    const product1 = new ProductManager('productos.json');
    const { pid } = req.params;
    // product = await product1.getProductsById(parseInt(pid));
    res.json(await product1.getProductsById(pid));
});

router.post('/products/', async (req, res) => {
    const product1 = new ProductManager('productos.json')
    const { body } = req;
    const newProduct = {
        ...body,
    }
    res.status(201).json(await product1.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock, newProduct.category))
});

router.put('/products/:pid/', async (req, res) => {
    const product1 = new ProductManager('productos.json')
    const { body } = req;
    const { pid } = req.params;
    // await product1.updateProduct(parseInt(pid), body);
    res.json(await product1.updateProduct(pid, body));
});

router.delete('/products/:pid/', async (req, res) => {
    const product1 = new ProductManager('productos.json')
    const { pid } = req.params;
    // await product1.deleteProduct(parseInt(pid));
    res.json(await product1.deleteProduct(pid));
});

export default router;
