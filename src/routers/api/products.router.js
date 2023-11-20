import { Router } from 'express';

import ProductManager from '../../dao/Dao/productManager.js';
import ProductManagerDB from '../../dao/Dao/Products.manager.js';

const router = Router();
// rutas file system
// router.get('/products/', async (req, res) => {
//     const { query } = req;
//     const { limit } = query;

//     const product1 = new ProductManager('productos.json');
//     console.log(product1);
//     const products = await product1.getProducts();
//     if (!limit) {
//         res.json(products);
//     } else {
//         console.log(limit);
//         const limitProducts = products.slice(0, parseInt(limit));
//         res.json(limitProducts);
//     }
// });

router.get('/products/:pid/', async (req, res) => {
    const product1 = new ProductManager('productos.json');
    const { pid } = req.params;
    // product = await product1.getProductsById(parseInt(pid));
    res.json(await product1.getProductsById(pid));
});

// router.post('/products/', async (req, res) => {
//     const product1 = new ProductManager('productos.json')
//     const { body } = req;
//     const newProduct = {
//         ...body,
//     }
//     res.status(201).json(await product1.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock, newProduct.category))
// });

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

//=====================================================================================================================================================
// rutas MongoDB

router.get('/products', async (req, res) => {
    const { query } = req;
    const { limit } = query;

    const products = await ProductManagerDB.get();
    console.log(products);
    if (!limit) {
        // res.json(products);
        res.status(200).json(products);
    } else {
        console.log(limit);
        const limitProducts = products.slice(0, parseInt(limit));
        // res.json(limitProducts);
        res.status(200).json(limitProducts);
    }
});

router.post('/products', async (req, res) => {
    const { body } = req;
    const prodcuts = await ProductManagerDB.create(body);
    res.status(201).json(prodcuts);
  });


export default router;
