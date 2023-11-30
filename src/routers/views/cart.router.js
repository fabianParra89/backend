import { Router } from 'express';
import CartsManager from '../../dao/Dao/Carts.manager.js';

const router = Router();

router.get('/carts/:cid/', async (req, res) => {
    const { cid } = req.params;
    const result = await CartsManager.getProductsCartsById(cid);
    const productsInCarrito =  result.products.map((prod) => prod.toJSON())
    res.render('cart', { title: 'Coder House Admin', prodInCart: productsInCarrito });
});

export default router;