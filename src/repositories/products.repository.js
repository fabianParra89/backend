
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

     async getAll(criterio = {}, options = {}) {
        return this.dao.getAll(criterio, options);
    }

    async getById(pid) {
        const product = await this.dao.getById(pid);
        return product;
    }

    async getByCode(code) {
        const product = await this.dao.getByCode(code);
        return product;
    }

    async create(data) {
        return await this.dao.create(data);
    }

    async updateById(pid, data) {
        return await this.dao.updateById(pid, data);
    }

    async deleteById(pid, data) {
        return await this.dao.deleteById(pid);
    }
}