import { Router } from 'express';
import ProductsController from "../../controllers/products.controllers.js";
import ProductManager from '../../dao/Dao/Products.manager.js';
import { buildResponsePaginated, authMiddleware } from '../../utils.js';
import passport from 'passport';

const router = Router();

router.get('/products', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { query } = req;
        console.log(query);
        const { limit = 10, page = 1, sort, search } = query;

        const criterio = {};
        const options = { limit, page };

        if (sort) {
            options.sort = { price: sort };
        }
        if (search) {
            criterio.category = search;
        }
        const products = await ProductsController.getAll(criterio, options);
        res.status(200).json(buildResponsePaginated({ ...products, sort, search }));
    } catch (error) {
        next(error);
    }
    //const result = await ProductManager.get(cirterio, options);
    //res.status(200).json(buildResponsePaginated({ ...result, sort, search }));

});
/*
router.get('/products', authMiddleware('jwt'), async (req, res) => {
    const { query } = req;
    const { limit = 10, page = 1, sort, search } = query;

    const cirterio = {};
    const options = { limit, page };

    if (sort) {
        options.sort = { price: sort };
    }
    if (search) {
        cirterio.category = search;
    }
    const result = await ProductManager.get(cirterio, options);
    res.status(200).json(buildResponsePaginated({ ...result, sort, search }));

});
*/

router.get('/products/:pid/',authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { pid } = req.params;
        const prodcut = await ProductsController.getById(pid);
        res.status(200).json(prodcut);
    } catch (error) {
        next(error);
    }
});
/*
router.get('/products/:pid/', async (req, res) => {
    const { pid } = req.params;
    const returnGetById = await ProductManager.getById(pid);
    res.status(returnGetById.statusCode).json((returnGetById.product) ? returnGetById.product : returnGetById);
});
*/

router.post('/products',authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { body } = req;
        const returnCreate = await ProductsController.create(body);
        res.status(201).json(returnCreate);
    } catch (error) {
        next(error);
    }
});

/*
router.post('/products', async (req, res) => {
    const { body } = req;
    const returnCreate = await ProductManager.create(body);
    res.status(returnCreate.statusCode).json((returnCreate.product) ? returnCreate.product : returnCreate);
});
*/


router.put('/products/:pid/',authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { body } = req;
        const { pid } = req.params;
        const returnUpdate = await ProductsController.updateById(pid, body);
        res.status(202).json(returnUpdate);
    } catch (error) {
        next(error);
    }
});
/*
router.put('/products/:pid/', async (req, res) => {

    const { body } = req;
    const { pid } = req.params;
    const returnUpdate = await ProductManager.updateById(pid, body);
    res.status(returnUpdate.statusCode).json(returnUpdate);
});
*/
router.delete('/products/:pid/',authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { pid } = req.params;
        const returnDelete = await ProductsController.deleteById(pid);
        res.status(200).json(returnDelete);

    } catch (error) {
        next(error);
    }
});
/*
router.delete('/products/:pid/', async (req, res) => {

    const { pid } = req.params;
    const returnDelete = await ProductManager.deleteById(pid);
    res.status(returnDelete.statusCode).json(returnDelete);
});
*/

export default router;
