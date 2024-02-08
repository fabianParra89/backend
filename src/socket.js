import { Server } from 'socket.io'

import ProductManager from './dao/Dao/productManager.js';
import MessageManager from './dao/Dao/Messages.manager.js';
import { logger } from "../src/config/logger.js";

let io;
let conversation = [];
const product1 = new ProductManager('productos.json');
let products = await product1.getProducts();


const initialMessage = [{
  user: 'Administrador',
  message: 'Hola a la comunidad',
}];

// MessageManager.addMessage(conversation[0]);

export const init = (httpServer) => {
  io = new Server(httpServer);

  io.on('connection', (socketClient) => {

    logger.info(`cliente conectado ${socketClient.id} 🎊`);

    socketClient.emit('update-products', products);

    socketClient.on('new-product', async (newProduct) => {
      await product1.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock, newProduct.category)
      products = await product1.getProducts()
      io.emit('update-products', products);
    });

    socketClient.on('delete-product', async (productId) => {
      logger.info(productId);
      await product1.deleteProduct(productId)
      products = await product1.getProducts()
      io.emit('update-products', products);
    });

    socketClient.emit('update-conversation', initialMessage);



    socketClient.on('new-message', async (newMessage) => {
      conversation.push(newMessage);
      await MessageManager.addMessage(newMessage);
      const messagesDB = await MessageManager.getConversation();
      io.emit('update-conversation', messagesDB);
    })

    // socketClient.emit('client-emit', { status: "ok" });
    // socketClient.broadcast.emit('broadcast-emit', { status: "ok" });
    // socketServer.emit('all-clients', { status: "ok" });
  });


}

export const newMessageFromAPI = (newMessage) => {
  conversation.push(newMessage);
  io.emit('update-conversation', conversation);
}