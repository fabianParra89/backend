import CartDao from "../dao/cart.dao.js";

export default class CartService {
    static getAll(criterio = {}, options = {}) {
        return CartDao.getAll(criterio, options);
    }

    static async getById(cid) {
        const cart = await CartDao.getById(cid);
        return cart;
    }

    static async getPopulate(cid) {
        const cart = await CartDao.getById(cid).populate('products.product');
        return cart;
    }

    static async getProductInCarrito(cid, pid) {
        const productInCarrito = await CartDao.getProductInCarrito(cid, pid);
        return productInCarrito;
    }

    static async getByCode(code) {
        const cart = await CartDao.getByCode(code);
        return cart;
    }

    static async create(data) {
        return await CartDao.create(data);
    }

    static async updateByIdSet(cid, data) {
        return await CartDao.updateById({ _id: cid }, { $set: data });
    }

    static async updateByIdPush(cid, data) {
        return await CartDao.updateById({ _id: cid }, { $push: { products: data } });
    }

    static async deleteById(cid) {
        return  await CartDao.deleteById(cid);
    }

}