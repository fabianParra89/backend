import express from 'express';
import handlebars from "express-handlebars";
// import { promises as fs } from 'fs';
import path from "path";
import sessions from "express-session"
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParse from 'cookie-parser';



import { Exception, __dirname } from './utils.js';
import { URI } from "./db/mongodb.js";
// (__dirname);
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import userRouter from './routers/api/users.router.js';
import authRouter from './routers/api/auth.router.js';

import indexRouter from './routers/views/index.router.js';
import messagesRouter from './routers/views/messages.route.js';
import sessionsRouter from './routers/views/sessions.router.js';
import products from './routers/views/products.router.js';
import cartsViewRouter from './routers/views/cart.router.js';
import { init as initPasport } from "./config/passport.config.js";


import realTimeProdcuts from './routers/views/realTimeProducts.router.js';


const app = express()

// const SESSION_SECRET = 'ejUrAe7$7fJA^vEpBeZP%HqDK9i$V3ft';

// app.use(sessions({
//     store: MongoStore.create({
//         mongoUrl: URI,
//         mongoOptions: {},
//         ttl: 60*30,
//     }),
//     secret: SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
// }));

app.use(cookieParse())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPasport();
app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter, realTimeProdcuts, products, cartsViewRouter);
app.use('/chat', messagesRouter);
app.use('/api',authRouter, productsRouter, cartsRouter, sessionsRouter,userRouter);

express.static.mime.types['.css'] = 'text/css';
app.use('/public', express.static(path.join(__dirname, '../public')));

/*pp.use((error, req, res, next) => {
    const message = 'ocurrio un error desconocido: ' + error.message;
    console.error(message);
    res.status(500).json({ message });
})*/
app.use((error, req, res, next) => {
    const message = error instanceof Exception ? error.message : `Ah ocurrido un error desconocido 😨: ${error.message}`;
    console.log(message);
    res.status(error.statusCode || 500).json({ status: 'error', message });
  });

export default app;