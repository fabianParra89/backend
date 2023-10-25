const { Router } = require('express');
const CartsManager = require('../cartsManager');
const { v4: uuidV4 } = require('uuid');

const router = Router();

router.post('/carts/', async (req, res) => {
    const cart = {
        id: uuidV4(),
        products: []
    };
    const cart1 = new CartsManager('../carts.json', cart);

    await cart1.addCart(cart);
    res.status(201).json(cart1);
});

router.post('/carts/:cid/product/:pid/', async (req, res) => {
    const cart1 = new CartsManager('../carts.json');
    const { cid } = req.params;
    const { pid } = req.params;
    
    const cartID = await cart1.addProductCartbyId(cid, pid);
    console.log(cartID);
    res.status(201).json(cartID);
});

router.get('/carts/:cid/', async (req, res) => {
    const cart1 = new CartsManager('../carts.json');
    const { cid } = req.params;
    console.log(cid);
    products = await cart1.getProductsCartsById(cid);
    res.json(products);
});

module.exports = router;