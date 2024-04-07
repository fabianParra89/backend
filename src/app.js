import express from 'express';
import handlebars from "express-handlebars";
// import { promises as fs } from 'fs';
import path from "path";
// import sessions from "express-session"
// import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParse from 'cookie-parser';
import cors from "cors";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



import { __dirname } from './utils/utils.js';

// (__dirname);
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import userRouter from './routers/api/users.router.js';
import authRouter from './routers/api/auth.router.js';
import mockingRouter from './routers/api/mocking.router.js';
import loggerRouter from './routers/api/logger.router.js'
import mailRouter from "./routers/api/mail.router.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.meddleware.js";
import { addLogger } from "./config/logger.js";

import indexRouter from './routers/views/index.router.js';
import messagesRouter from './routers/views/messages.route.js';
import sessionsRouter from './routers/views/sessions.router.js';
import products from './routers/views/products.router.js';
import users from './routers/views/users.router.js';
import cartsViewRouter from './routers/views/cart.router.js';
import { init as initPasport } from "./config/passport.config.js";



import realTimeProdcuts from './routers/views/realTimeProducts.router.js';


const app = express()

const corsOptions = {
    origin: 'http://localhost:5500',
    methods: ['GET','POST','PUT','DELETE'],
};

app.use(addLogger);
app.use(cors());
app.use(cookieParse())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPasport();
app.use(passport.initialize());

if (process.env.ENV !== 'PRD') {
    const swaggerOpts = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Ecommerce API',
          description: 'Esta es la documentación de la API de Ecommerce. Una aplicación para Gestion de tu pedido.',
        },
      },
      apis: [path.join(__dirname, '.', 'docs', '**', '*.yaml')],
    };
    const specs = swaggerJsDoc(swaggerOpts);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

app.use('/', indexRouter, realTimeProdcuts, products, cartsViewRouter, mockingRouter, loggerRouter, users);
app.use('/chat', messagesRouter);
app.use('/api',authRouter, productsRouter, cartsRouter, sessionsRouter,userRouter, mailRouter);

express.static.mime.types['.css'] = 'text/css';
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(errorHandlerMiddleware);


export default app;