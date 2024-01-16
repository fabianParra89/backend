import ProductDao from "../dao/product.dao.js";

export default class ProductService {
    static getAll(criterio = {}, options = {}) {
        return ProductDao.getAll(criterio, options);
    }

    static async getById(pid) {
        const product = await ProductDao.getById(pid);
        return product;
    }

    static async getByCode(code) {
        const product = await ProductDao.getByCode(code);
        return product;
    }

    static async create(data) {
        return await ProductDao.create(data);
    }

    static async updateById(pid, data) {
        return await ProductDao.updateById(pid, data);
    }

    static async deleteById(pid, data) {
        return  await ProductDao.deleteById(pid);
    }

}