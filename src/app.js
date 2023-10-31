import express from 'express';
// import { promises as fs } from 'fs';

import productsRouter from './routers/products.router.js';
import cartsRouter  from './routers/carts.router.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const test = async () => {
//     console.log(await product1.getProducts(''));
// }

// app.get('/', async (req, res) => {
//     // const products = await product1.getProducts();
//     res.send('+++++++++++++++++');
// });

app.use('/api', productsRouter, cartsRouter);


app.listen(8080, () => {
    console.log('Servidor http escuchando en el puerto 8080.');
});
