import CartsServices from "../services/cart.service.js";
import UserServices from "../services/user.service.js";
import ProductService from "../services/product.service.js";
import TicketsController from "./tickets.controllers.js";

import ProductsControllers from "./products.controllers.js";
import { CustomError } from "../utils/CustomError.js";
import { cartIdError, productIdError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";



export default class CartManager {

    static async addCart(userid) {
        const cart = {
            product: []
        };
        // console.log(`Cart is created successfully (${cartCreate._id}) 😁.`);
        const cartCreated = await CartsServices.create(cart);
        const response = await UserServices.updateByIdPush(userid, cartCreated._id);
        console.log(response);
        return cartCreated
    }


    static async addProductCartbyId(cartId, productId, body) {

        const cart = await CartsServices.getById(cartId);

        if (!cart) {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cartId),
                  message: 'Error al obtener el carrito por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cartId} no encontrado 😱`);
        }

        const products = await ProductsControllers.getById(productId);
        const { quantity } = body;
        // console.log(products);
        if (!products) {
            CustomError.create(
                {
                  name: 'id de producto invalido',
                  cause: productIdError(productId),
                  message: 'Error al obtener el producto por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Producto con id ${productId} no encontrado 😱`);
        }

        const productInCarrito = await CartsServices.getProductInCarrito(cartId, productId);
        if (productInCarrito && productInCarrito.length > 0) {
            cart.products.forEach(prod => {
                if (prod.product.toString() === productId) {
                    prod.quantity += quantity;
                }
            });
            const updateProd = { 'products': cart.products };
            return await CartsServices.updateByIdSet(cartId, updateProd);
        } else {
            const productNew = {
                product: productId,
                quantity: quantity
            }
            return await CartsServices.updateByIdPush(cartId, productNew);
        }
        /*
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
        */
    }

    static async getProductsCartsById(cartId) {

        const cart = await CartsServices.getPopulate(cartId);
        if (!cart) {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cartId),
                  message: 'Error al obtener el carrito por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cartId} no encontrado 😱`);
        }
        return cart.products;
    }

    static async deleteProductCartById(cartId, productId) {
        const cart = await CartsServices.getById(cartId);
        if (!cart) {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cartId),
                  message: 'Error al obtener el carrito por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cartId} no encontrado 😱`);
        }
        const productsInCarrito = cart.products;
        console.log(productsInCarrito);
        const newProductsInCarrito = productsInCarrito.filter(prod => prod.product.toString() !== productId);
        console.log(newProductsInCarrito);
        const productUpdate = await CartsServices.updateByIdSet(cartId, { products: newProductsInCarrito });
        return {
            message: `Product with id: ${productId} delete successfully`
        };
    }


    static async updateProductsCart(cartId, products) {
        const cart = await CartsServices.getById(cartId);
        if (!cart) {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cartId),
                  message: 'Error al obtener el carrito por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cartId} no encontrado 😱`);
        }
        return await CartsServices.updateByIdSet(cartId, { products: products });
    }

    static async updateProductQuantity(cartId, productId, body) {
        const cart = await CartsServices.getById(cartId);
        if (!cart) {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cartId),
                  message: 'Error al obtener el carrito por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cartId} no encontrado 😱`);
        }
        const products = await ProductsControllers.getById(productId);
        const { quantity } = body;

        if (!products) {
            CustomError.create(
                {
                  name: 'id de producto invalido',
                  cause: productIdError(productId),
                  message: 'Error al obtener el producto por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Producto con id ${productId} no encontrado 😱`);
        }

        const productInCarrito = await CartsServices.getProductInCarrito(cartId, productId);
        if (productInCarrito && productInCarrito.length > 0) {
            cart.products.forEach(prod => {
                if (prod.product.toString() === productId) {
                    prod.quantity = quantity;
                }
            });
            const updateProd = { 'products': cart.products };
            return await CartsServices.updateByIdSet(cartId, updateProd);
        } else {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cartId),
                  message: 'Error al obtener el carrito por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cartId} no encontrado 😱`);
        }
        /*
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
    }*/
    }

    static async deleteProductsCart(cartId) {
        const cart = await CartsServices.getById(cartId);
        if (!cart) {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cartId),
                  message: 'Error al obtener el carrito por su id',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cartId} no encontrado 😱`);
        }
        return await CartsServices.updateByIdSet(cartId, { products: [] });
    }

    static async postPurchaser(req) {
        const { cid } = req.params;
        const email = req.user.email;
        const cartId = req.user.cartId;
        const cartFind = cartId.find((e) => e.cartId === cid);
        if (!cartFind) {
            CustomError.create(
                {
                  name: 'id de carrito invalido',
                  cause: cartIdError(cid),
                  message: 'El carrito no esta asignado al usuario',
                  code: EnumsError.INVALID_PARAMS_ERROR,
                }
              )
            // throw new NotFoundException(`Carrito con id ${cid} no asigando al usuario`);
        }

        const cart = await CartsServices.getById(cid);
        const productsInCart = cart.products;
        let noStokProduct = [];
        let stokProduct = [];
        let responseTicket = {};

        for (const e of productsInCart) {
            console.log(e);
            let product = await ProductService.getById(e.product);

            if (e.quantity <= product.stock) {
                product.stock = product.stock - e.quantity;
                let infoProducts = {
                    id: e.product,
                    quantity: e.quantity,
                    price: product.price
                };
                stokProduct.push(infoProducts);
                await ProductService.updateById(e.product, { "stock": product.stock });
            } else {
                noStokProduct.push(e);
            }
        }
        if (noStokProduct.length > 0) {
            await CartsServices.updateByIdSet(cid, { products: noStokProduct });
            responseTicket.productosSinStock =noStokProduct;
        } else{
            await CartsServices.updateByIdSet(cid, { products: [] });
        }

        if (stokProduct.length > 0) {
            const amount = stokProduct.reduce((total, producto) => total + (producto.price * producto.quantity), 0);
            const dataTicket = {
                amount: amount, 
                purchaser: email,
                purchaser_datetime: new Date()
            }
            const ticket = await TicketsController.create(dataTicket);
            responseTicket.infoTicket = ticket;
            
        }
        return responseTicket;
    }

}
