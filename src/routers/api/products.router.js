import { Router } from 'express';
import ProductsController from "../../controllers/products.controllers.js";
import { buildResponsePaginated, authMiddleware, authRolesMiddleware } from '../../utils/utils.js';
import UsersController from "../../controllers/users.controllers.js"
import MailController from "../../controllers/mailRecovery.controller.js"


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
});

router.get('/products/:pid/', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { pid } = req.params;
        const prodcut = await ProductsController.getById(pid);
        res.status(200).json(prodcut);
    } catch (error) {
        next(error);
    }
});


router.post('/products', authMiddleware('jwt'), authRolesMiddleware(['admin', 'premium']), async (req, res, next) => {
    try {
        const { body, user } = req;
        const returnCreate = await ProductsController.create(body, user);
        res.status(201).json(returnCreate);
    } catch (error) {
        next(error);
    }
});


router.put('/products/:pid/', authMiddleware('jwt'), authRolesMiddleware(['admin', 'premium']), async (req, res, next) => {
    try {
        const { body } = req;
        const { pid } = req.params;
        const returnUpdate = await ProductsController.updateById(pid, body);
        res.status(202).json(returnUpdate);
    } catch (error) {
        next(error);
    }
});

router.delete('/products/:pid/', authMiddleware('jwt'), authRolesMiddleware(['admin', 'premium']), async (req, res, next) => {
    try {
        const { pid } = req.params;
        const { user } = req;
        const prodcut = await ProductsController.getById(pid);
        console.log('prodcut', prodcut);
        if (prodcut.owner !== 'admin') {
            const userOwner = await UsersController.getById(prodcut.owner);
            MailController.emailProductDelete(userOwner.email, prodcut)
        }
        const returnDelete = await ProductsController.deleteById(pid, user);
        res.status(200).json(returnDelete);

    } catch (error) {
        next(error);
    }
});

export default router;
