// import CartDao from "../dao/cart.mongoDB.dao.js";
// import { CartDao } from "../dao/factory.js";
import { cartsRepository } from "../repositories/index.js";

export default class CartService {
    static async getAll(criterio = {}, options = {}) {
        return cartsRepository.getAll(criterio, options);
    }

    static async getById(cid) {
        const cart = await cartsRepository.getById(cid);
        return cart;
    }

    static async getPopulate(cid) {
        const cart = await cartsRepository.getById(cid).populate('products.product');
        return cart;
    }

    static async getProductInCarrito(cid, pid) {
        const productInCarrito = await cartsRepository.getProductInCarrito(cid, pid);
        return productInCarrito;
    }

    static async getByCode(code) {
        const cart = await cartsRepository.getByCode(code);
        return cart;
    }

    static async create(data) {
        return await cartsRepository.create(data);
    }

    static async updateByIdSet(cid, data) {
        return await cartsRepository.updateByIdSet( cid ,  data );
    }

    static async updateByIdPush(cid, data) {
        return await cartsRepository.updateByIdPush( cid , data );
    }

    static async deleteById(cid) {
        return await cartsRepository.deleteById(cid);
    }

}