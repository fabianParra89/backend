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
            if (cart) {
                const products = await ProductManager.getById(productId);
                const { quantity } = body;
                if (products.statusCode != 200) {
                    return {
                        status: 'Error',
                        description: `Product with id: ${productId} not found`,
                        statusCode: 404
                    };
                }
                const productInCarrito = await cartModel.find({ $and: [{ _id: cartId }, { 'products.product': productId }] })
                if (productInCarrito && productInCarrito.length > 0) {
                    cart.products.forEach(prod => {
                        if (prod.product.toString() === productId) {
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
                        product: productId,
                        quantity: quantity
                    }
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
            const cart = await CartModel.findOne({ _id: cartId }).populate('products.product');
            if (!cart) {
                return {
                    status: 'Error',
                    description: `Cart with id: ${cartId} not found`,
                    statusCode: 404
                };
            }
            const productInCarrito = cart.products;
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

    static async deleteProductCartById(cartId, productId) {

        try {
            const cart = await CartModel.findOne({ _id: cartId })
            if (!cart) {
                return {
                    status: 'Error',
                    description: `Cart with id: ${cartId} not found`,
                    statusCode: 404
                };
            }
            const productsInCarrito = cart.products;
            const newProductsInCarrito = productsInCarrito.filter(prod => prod.product.toString() !== productId);
            const productUpdate = await CartModel.updateOne({ _id: cartId }, { $set: { products: newProductsInCarrito } });
            return {
                message: `Product with id: ${productId} delete successfully`,
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


    static async updateProductsCart(cartId, products) {
        try {
            const cart = await CartModel.findOne({ _id: cartId })
            if (!cart) {
                return {
                    status: 'Error',
                    description: `Cart with id: ${cartId} not found`,
                    statusCode: 404
                };
            }
            const updateCart = await CartModel.updateOne({ _id: cartId }, { $set: { "products": products } });
            return {
                prodcuts: updateCart,
                message: `products successfully updated`,
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

    static async updateProductQuantity(cartId, productId, body) {
        try {
            const cart = await CartModel.findById(cartId);
            if (cart) {
                const products = await ProductManager.getById(productId);
                const { quantity } = body;
                if (products.statusCode != 200) {
                    return {
                        status: 'Error',
                        description: `Product with id: ${productId} not found`,
                        statusCode: 404
                    };
                }
                const productInCarrito = await cartModel.find({ $and: [{ _id: cartId }, { 'products.product': productId }] })
                if (productInCarrito && productInCarrito.length > 0) {
                    cart.products.forEach(prod => {
                        if (prod.product.toString() === productId) {
                            prod.quantity = quantity;
                        }
                    });
                    const updateProd = { 'products': cart.products };
                    const updateQuantity = await CartModel.updateOne({ _id: cartId }, { $set: updateProd });
                    return {
                        cart: updateQuantity,
                        message: "Quantity is updated successfully",
                        status: "Success",
                        statusCode: 200
                    };
                } else {
                    return {
                        message: "Cart not Found",
                        status: "Error",
                        statusCode: 404
                    };
                }
            } else {
                return {
                    message: "Product not Found",
                    status: "Error",
                    statusCode: 404
                };
            }
        } catch (error) {
            console.log(error.message);
            return {
                message: "Error add product to cart",
                status: "Error",
                statusCode: 400
            };
        }
    }

    static async deleteProductsCart(cartId) {
        try {
            const cart = await CartModel.findOne({ _id: cartId })
            if (!cart) {
                return {
                    status: 'Error',
                    description: `Cart with id: ${cartId} not found`,
                    statusCode: 404
                };
            }
            const updateCart = await CartModel.updateOne({ _id: cartId }, { $set: { "products": [] } });
            return {
                prodcuts: updateCart,
                message: `products delete successfully `,
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
