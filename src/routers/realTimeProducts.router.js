import { Router } from 'express';

import ProductManager from '../productManager.js';

const router = Router();
const product1 = new ProductManager('productos.json');

router.get('/realtimeproducts', async (req, res) => {
    const { query } = req;
    const { limit } = query;
    const products = await product1.getProducts();
    // console.log(products);
    res.render('realTimeProducts', { title: 'Coder House 🚀', name:'fabian parra'});
});

export default router;