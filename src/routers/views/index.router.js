import { Router } from 'express';

import ProductManager from '../../dao/Dao/productManager.js';
import ProductManagerDB from '../../dao/Dao/Products.manager.js';

const router = Router();

// ===========================================================================================================================================
//  index.router con file system
// const product1 = new ProductManager('productos.json');
// router.get('', async (req, res) => {
//     const { query } = req;
//     const { limit } = query;
//     const productsTot = await product1.getProducts();
//     if (!limit) {
//         const products = productsTot;
//         res.render('home', { title: 'Coder House 🚀', products });
//     } else {
//         const products = productsTot.slice(0, parseInt(limit));
//         res.render('home', { title: 'Coder House 🚀', products });
//     }
// });

// =============================================================================================================================================
//  index.router con mongodb

router.get('', async (req, res) => {
    const { query } = req;
    const { limit } = query;

    const response = await ProductManagerDB.get();
    const product1 = response.docs;
    console.log(product1);
    if (!limit) {
        const products = product1;
        res.render('home', { title: 'Coder House 🚀', products: products.map(prodcut =>prodcut.toJSON()) });
    } else {
        const products = product1.slice(0, parseInt(limit));
        res.render('home', { title: 'Coder Hous-rty 🚀', products: products.map(prodcut =>prodcut.toJSON()) });
    }
});

export default router;


