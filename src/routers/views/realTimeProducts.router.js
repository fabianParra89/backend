import { Router } from 'express';

import ProductManager from '../../dao/Dao/productManager.js';
import ProductManagerDB from '../../dao/Dao/Products.manager.js';

const router = Router();

//================================================================================================================================= 
const product1 = new ProductManager('productos.json');
router.get('/realtimeproducts', async (req, res) => {
    const { query } = req;
    const { limit } = query;
    const products = await product1.getProducts();
    res.render('realTimeProducts', { title: 'Coder House 🚀', name:'fabian parra'});
});

export default router;