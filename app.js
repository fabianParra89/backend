const express = require('express');
const ProductManager = require('./productManager');
const { promises: fs } = require('fs');




const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const test = async () => {
    console.log(await product1.getProducts(''));
}

app.get('/', async (req, res) => {
    // const products = await product1.getProducts();
    res.send('+++++++++++++++++');
});
app.get('/products', async (req, res) => {
    const { query } = req;
    const { limit } = query;

    const product1 = new ProductManager('./users.json');
    const products = await product1.getProducts();
    if (!limit) {
        res.json(products);
    } else {
        console.log(limit);
        const fiveProducts = products.slice(0, parseInt(limit));
        res.json(fiveProducts);
    }
});

app.get('/products/:pid', async (req, res) => {
    const product1 = new ProductManager('./users.json');
    const { pid } = req.params;
    product = await product1.getProductsById(parseInt(pid));
    res.json(product);
});

app.listen(8080, () => {
    console.log('Servidor http escuchando en el puerto 8080.');
});
