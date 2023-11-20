import { Server } from 'socket.io'

import ProductManager from './dao/Dao/productManager.js';
let io;
const product1 = new ProductManager('productos.json');
let products = await product1.getProducts();

export const init = (httpServer) => {
  io = new Server(httpServer);

  io.on('connection', (socketClient) => {

    console.log(`cliente conectado ${socketClient.id} 🎊`);

    socketClient.emit('update-products', products);

    socketClient.on('new-product', async (newProduct) => {
        // console.log(products);
        await product1.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock, newProduct.category)
        products = await product1.getProducts()
        io.emit('update-products', products);
      });

      socketClient.on('delete-product', async (productId) => {
        console.log(productId);
        await product1.deleteProduct(productId)
        products = await product1.getProducts()
        io.emit('update-products', products);
      });

    // socketClient.emit('client-emit', { status: "ok" });
    // socketClient.broadcast.emit('broadcast-emit', { status: "ok" });
    // socketServer.emit('all-clients', { status: "ok" });
  });
} 