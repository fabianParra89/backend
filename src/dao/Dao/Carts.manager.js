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

                const cartCreado =   await CartModel.updateOne({ '_id': cartId }, { $push: { products: { idProduct: productId, quantity: quantity } } });

                console.log(cartCreado);
                //     const productCart = _cart.product.find(p => p.id === productId);
                //     if (productCart) {
                //         productCart.quantity += quantity;
                //     } else {
                //         let newProduct = {
                //             id: productId,
                //             quantity: quantity
                //         }
                //         _cart.product.push(newProduct)
                //     }
                return {
                    cart: cart,
                    status: 'Success',
                    description: `Product with id ${productId} is add successfully`,
                    statusCode: 200
                };
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
}