import { Router } from 'express';


// import CartsManager from '../../dao/Dao/Carts.manager.js';
import CartsControllers from "../../controllers/carts.controllers.js";
import { authMiddleware, authRolesMiddleware } from '../../utils.js';

const router = Router();

router.post('/carts/', authMiddleware('jwt'), authRolesMiddleware('user'), async (req, res, next) => {
    try {
        // console.log('User id',req.user);
        const cart = await CartsControllers.addCart(req.user.id);
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }

});

router.post('/carts/:cid/product/:pid/', authMiddleware('jwt'), authRolesMiddleware('user'), async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const { body } = req;
        const cartID = await CartsControllers.addProductCartbyId(cid, pid, body);
        res.status(200).json(cartID);
    } catch (error) {
        next(error);
    }
});


router.get('/carts/:cid/' , authMiddleware('jwt') , async (req, res, next) => {
    try {
        const { cid } = req.params;
        const products = await CartsControllers.getProductsCartsById(cid);
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
});

router.delete('/carts/:cid/product/:pid/' , authMiddleware('jwt'),authRolesMiddleware('user'), async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cartID = await CartsControllers.deleteProductCartById(cid, pid);
        res.status(200).json(cartID);
    } catch (error) {
        next(error);
    }

});

router.put('/carts/:cid/', authMiddleware('jwt') ,authRolesMiddleware('user'), async (req, res, next) => {
    try {
        const { body } = req;
        const { cid } = req.params;
        const returnUpdate = await CartsControllers.updateProductsCart(cid, body);
        res.status(200).json(returnUpdate);
    } catch (error) {
        next(error);
    }

});

router.put('/carts/:cid/product/:pid/', authMiddleware('jwt') ,authRolesMiddleware('user'), async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const { body } = req;
        const cartID = await CartsControllers.updateProductQuantity(cid, pid, body);
        res.status(200).json(cartID);
    } catch (error) {
        next(error);
    }

});

router.delete('/carts/:cid/', authMiddleware('jwt') ,authRolesMiddleware('user'), async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cartID = await CartsControllers.deleteProductsCart(cid);
        res.status(200).json(cartID);
    } catch (error) {
        next(error);
    }
});

router.post('/carts/:cid/purchaser', authMiddleware('jwt'), authRolesMiddleware('user'), async (req, res, next) => {
    try {
        const cartID = await CartsControllers.postPurchaser(req);
        res.status(200).json(cartID);
    } catch (error) {
        next(error);
    }
});

export default router;