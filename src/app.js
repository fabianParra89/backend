import express from 'express';
import handlebars from "express-handlebars";
// import { promises as fs } from 'fs';
import path from "path";


import { __dirname } from './utils.js';
// (__dirname);
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import indexRouter  from './routers/views/index.router.js';
import messagesRouter from './routers/views/messages.route.js';

import products from './routers/views/products.router.js';
import cartsViewRouter from './routers/views/cart.router.js';


import realTimeProdcuts  from './routers/views/realTimeProducts.router.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexRouter, realTimeProdcuts, products, cartsViewRouter);
app.use('/chat',  messagesRouter);
app.use('/api', productsRouter, cartsRouter);

express.static.mime.types['.css'] = 'text/css';
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use((error, req, res, next) => {
    const message = 'ocurrio un error desconocido: '+error.message;
    console.error(message);
    res.status(500).json({message}); 
})


export default app;