import cartModel from '../models/cart.model.js';
import CartModel from '../models/cart.model.js';
import ProductManager from './Products.manager.js';

export default class CartManager {
    static async addCart() {
        const cart = {
            product: []
        };
        const cartCreate = await CartModel.create(cart);
        console.log(`Cart is created successfully (${cartCreate._id}) 😁.`);
        return cartCreate;
    }


    static async addProductCartbyId(cartId, productId, body) {
        try {
            const cart = await CartModel.findById(cartId);
            // console.log(_cart)
            if (cart) {
                //     const product1 = new ProductManager('productos.json');
                const products = await ProductManager.getById(productId);
                const { quantity } = body;
                console.log(products);
                //  const validateProducts = products.some(vp => vp.id === productId);
                if (products.statusCode != 200) {
                    return {
                        status: 'Error',
                        description: `Product with id: ${productId} not found`,
                        statusCode: 404
                    };
                }
                const productInCarrito = await cartModel.find({ $and: [{ _id: cartId }, { 'products.idProduct': productId }] })
                console.log(productInCarrito);
                if (productInCarrito && productInCarrito.length > 0) {
                    cart.products.forEach(prod => {
                        if (prod.idProduct === productId) {
                            prod.quantity += quantity;
                        }
                    });
                    const updateProd = { 'products': cart.products };
                    const updateQuantity = await CartModel.updateOne({ _id: cartId }, { $set: updateProd });
                    return {
                        cart: updateQuantity,
                        message: "Product is updated successfully",
                        status: "Success",
                        statusCode: 200
                    };
                } else {
                    const productNew = {
                        idProduct: productId,
                        quantity: quantity
                    }
                    console.log(productNew);
                    const updateQuantity = await CartModel.updateOne({ _id: cartId }, { $push: { products: productNew } });
                    return {
                        cart: updateQuantity,
                        message: "Product is added successfully",
                        status: "Success",
                        statusCode: 200
                    };
                }
            } else {
                return {
                    status: 'Error',
                    description: `Cart with id: ${cartId} not found`,
                    statusCode: 404
                };
            }

        } catch (error) {
            return {
                message: error.message,
                status: "Error",
                statusCode: 400
            };
        }

    }

    static async getProductsCartsById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return {
                    status: 'Error',
                    description: `Cart with id: ${cartId} not found`,
                    statusCode: 404
                };   
            }
            const productInCarrito = cart.products;
            console.log(productInCarrito);
            return {
                products: productInCarrito,
                message: 'oks',
                status: "Success",
                statusCode: 200
            }; 
        } catch (error) {
            return {
                message: error.message,
                status: "Error",
                statusCode: 400
            };
        }
    }
}