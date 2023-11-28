import { Router } from 'express';

import ProductManager from '../../dao/Dao/Products.manager.js';
import { buildResponsePaginated } from '../../utils.js';

const router = Router();

router.get('/products', async (req, res) => {
    const { query } = req;
    const { limit = 10, page = 1, sort, search } = query;

    // const products = await ProductManager.get();
    // console.log(products);
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
    // if (!limit) {
    //     // res.json(products);
    //     res.status(200).json(products);
    // } else {
    //     console.log(limit);
    //     const limitProducts = products.slice(0, parseInt(limit));
    //     // res.json(limitProducts);
    //     res.status(200).json(limitProducts);
    // }
});

router.get('/products/:pid/', async (req, res) => {
    // const product1 = new ProductManager('productos.json');
    const { pid } = req.params;
    console.log(pid);
    const returnGetById = await ProductManager.getById(pid);
    res.status(returnGetById.statusCode).json((returnGetById.product) ? returnGetById.product : returnGetById);
});

router.post('/products', async (req, res) => {
    const { body } = req;
    const returnCreate = await ProductManager.create(body);
    res.status(returnCreate.statusCode).json((returnCreate.product) ? returnCreate.product : returnCreate);
});

router.put('/products/:pid/', async (req, res) => {

    const { body } = req;
    const { pid } = req.params;
    const returnUpdate = await ProductManager.updateById(pid, body);
    // await product1.updateProduct(parseInt(pid), body);
    res.status(returnUpdate.statusCode).json(returnUpdate);
});

router.delete('/products/:pid/', async (req, res) => {

    const { pid } = req.params;
    const returnDelete = await ProductManager.deleteById(pid);
    res.status(returnDelete.statusCode).json(returnDelete);
});

export default router;
