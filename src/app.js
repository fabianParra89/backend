import express from 'express';
import handlebars from "express-handlebars";
// import { promises as fs } from 'fs';
import path from "path";


import { __dirname } from './utils.js';
// console.log(__dirname);
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import indexRouter  from './routers/views/index.router.js';
import messagesRouter from './routers/views/messages.route.js';

import realTimeProdcuts  from './routers/views/realTimeProducts.router.js';
// import ProductManager from './productManager.js';

// const product1 = new ProductManager('productos.json');
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexRouter, realTimeProdcuts);
app.use('/chat',  messagesRouter);
app.use('/api', productsRouter, cartsRouter);

app.use((error, req, res, next) => {
    const message = 'ocurrio un error desconocido: '+error.message;
    console.error(message);
    res.status(500).json({message}); 
})

// app.use('/', async (req, res) => {
//     const products = await product1.getProducts();
//     console.log(products);
//     res.render('home', {title: 'Coder House 🚀', products} )
    
// });

// app.listen(PORT, () => {
//     console.log(`Servidor http escuchando en el puerto ${PORT}.`);
// });

export default app;