import { Router } from 'express';
import CartsManager from '../../dao/Dao/Carts.manager.js';
import CartsControllers from "../../controllers/carts.controllers.js";
import UserController from "../../controllers/users.controllers.js";
import { authMiddleware, authRolesMiddleware } from '../../utils/utils.js';

const router = Router();

router.get('/carts/:cid/', async (req, res) => {
    const { cid } = req.params;
    const result = await CartsManager.getProductsCartsById(cid);
    // const result = await CartsControllers.getProductsCartsById(cid);
    
    const productsInCarrito = result.products.map((prod) => prod.toJSON())
    res.render('cart', { title: 'Coder House Admin', prodInCart: productsInCarrito });
});

router.get('/carts/product/:pid', authMiddleware('jwt'), authRolesMiddleware(['user', 'premium']), async (req, res, next) => {
    try {
        // console.log('User id',req.user);
        const { pid } = req.params;
        const user = await UserController.getById(req.user.id);
        console.log('user', user);
        console.log('user.cartId.lenght', user.cartId.length);
        const body = {
            "quantity": 1
        }
        if (user.cartId.length === 0) {
            const cart = await CartsControllers.addCart(req.user.id);
            const cartID = await CartsControllers.addProductCartbyId(cart._id, pid, body, req.user);
        } else {
            const cartID = user.cartId[0].cartId;
            const cart = await CartsControllers.addProductCartbyId(cartID, pid, body, req.user);
        }
        res.redirect('/products')
    } catch (error) {
        next(error);
    }
});

// router.get('/carts/:cid/purchaser', authMiddleware('jwt'), authRolesMiddleware(['user', 'premium']), async (req, res, next) => {
//     try {
//         const ticket = await CartsControllers.postPurchaser(req);
//         res.status(200).json(ticket);
//     } catch (error) {
//         next(error);
//     }
// });

export default router;