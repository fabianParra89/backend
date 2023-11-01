import { Router } from 'express';

import ProductManager from '../productManager.js';

const router = Router();
const product1 = new ProductManager('productos.json');

router.get('', async (req, res) => {
    const { query } = req;
    const { limit } = query;
    const products = await product1.getProducts();
    res.render('home', { title: 'Coder House 🚀', products});
});

export default router;