import { Router } from 'express';

import CartsManager from '../../dao/Dao/Carts.manager.js';

const router = Router();

router.post('/carts/', async (req, res) => {
    const cart = await CartsManager.addCart();
    res.status(201).json(cart);
});

router.post('/carts/:cid/product/:pid/', async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    const { body } = req;
    
    const cartID = await CartsManager.addProductCartbyId(cid, pid, body);
    //console.log(cartID);
    res.status(cartID.statusCode).json(cartID);
});

router.get('/carts/:cid/', async (req, res) => {
    const { cid } = req.params;
    const products = await CartsManager.getProductsCartsById(cid);
    res.status(products.statusCode).json(products);
});

export default router;