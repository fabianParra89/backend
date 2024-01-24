// import UserDTO from "../dto/user.dto";


export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll(criterio = {}, options = {}) {
        return this.dao.getAll(criterio, options);
    }

    async getById(cid) {
        const cart = await this.dao.getById(cid);
        return cart;
    }

    async getPopulate(cid) {
        const cart = await this.dao.getById(cid).populate('products.product');
        return cart;
    }

    async getProductInCarrito(cid, pid) {
        const productInCarrito = await this.dao.getProductInCarrito(cid, pid);
        return productInCarrito;
    }

    async getByCode(code) {
        const cart = await this.dao.getByCode(code);
        return cart;
    }

    async create(data) {
        return await this.dao.create(data);
    }

    async updateByIdSet(cid, data) {
        return await this.dao.updateById({ _id: cid }, { $set: data });
    }

    async updateByIdPush(cid, data) {
        return await this.dao.updateById({ _id: cid }, { $push: { products: data } });
    }

    async deleteById(cid) {
        return await this.dao.deleteById(cid);
    }
}

