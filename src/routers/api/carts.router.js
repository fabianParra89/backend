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
    res.status(cartID.statusCode).json(cartID);
});

router.get('/carts/:cid/', async (req, res) => {
    const { cid } = req.params;
    const products = await CartsManager.getProductsCartsById(cid);
    res.status(products.statusCode).json(products);
});

router.delete('/carts/:cid/product/:pid/', async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    
    const cartID = await CartsManager.deleteProductCartById(cid, pid);
    res.status(cartID.statusCode).json(cartID);
});

router.put('/carts/:cid/', async (req, res) => {
    const { body } = req;
    const { cid } = req.params;
    const returnUpdate = await CartsManager.updateProductsCart(cid, body);
    res.status(returnUpdate.statusCode).json(returnUpdate);
});

router.put('/carts/:cid/product/:pid/', async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    const { body } = req;
    
    const cartID = await CartsManager.updateProductQuantity(cid, pid, body);
    res.status(cartID.statusCode).json(cartID);
});

router.delete('/carts/:cid/', async (req, res) => {
    const { cid } = req.params;
    
    const cartID = await CartsManager.deleteProductsCart(cid);
    res.status(cartID.statusCode).json(cartID);
});

export default router;