const express = require('express');
const { promises: fs } = require('fs');
const productsRouter = require('./routers/products.router');
const cartsRouter = require('./routers/carts.router');

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
