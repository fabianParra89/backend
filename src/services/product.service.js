// import ProductDao from "../dao/product.mongoDB.dao.js";
// import { ProductDao } from "../dao/factory.js";
import { productsRepository } from "../repositories/index.js";

export default class ProductService {
    static getAll(criterio = {}, options = {}) {
        return productsRepository.getAll(criterio, options);
    }

    static async getById(pid) {
        const product = await productsRepository.getById(pid);
        return product;
    }

    static async getByCode(code) {
        const product = await productsRepository.getByCode(code);
        return product;
    }

    static async create(data) {
        return await productsRepository.create(data);
    }

    static async updateById(pid, data) {
        return await productsRepository.updateById(pid, data);
    }

    static async deleteById(pid, data) {
        return await productsRepository.deleteById(pid);
    }

}