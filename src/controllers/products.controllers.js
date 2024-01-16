import ProductsServices from "../services/product.service.js";
import { InvalidDataException, NotFoundException } from "../utils.js";

export default class ProductsController {
    static getAll(criterio, options) {
        return ProductsServices.getAll(criterio, options);
    }

    static async getById(pid) {
        const prodcut = await ProductsServices.getById(pid);
        if (!prodcut) {
            throw new NotFoundException(`producto ${pid} no encontrado 😱`);
        }
        return prodcut;
    }

    static async create(data) {
        console.log(data);

        const {
            title,
            description,
            price,
            code,
            stock,
            status,
            category,
        } = data
        const productByCode = await ProductsServices.getByCode(code);

        if (productByCode) {
            throw new InvalidDataException(`producto con codigo ${code} ya existe 😱`);
        }

        if (!title || !description || !price || !code || !stock || !status || !category) {
            throw new InvalidDataException('Todos los campos son requidos 😱');
        }

        return await ProductsServices.create(data);
    }

    static async updateById(pid, data) {
        const prodcut = await ProductsServices.getById(pid);
        if (!prodcut) {
            throw new NotFoundException(`producto ${pid} no encontrado 😱`);
        }
        return await ProductsServices.updateById(pid, data);
    }

    static async deleteById(pid) {
        const prodcut = await ProductsServices.getById(pid);
        if (!prodcut) {
            throw new NotFoundException(`producto ${pid} no encontrado 😱`);
        }
        return await ProductsServices.deleteById(pid);
    }

    /*
      static create(data) {
        const {
          title,
          price,
          description,
          image,
        } = data;
        if (
          !title ||
          !price ||
          !description
        ) {
          throw new InvalidDataException('Todos los campos son requidos 😱');
        }
        const newProduct = {
          title,
          price,
          description,
          image,
        }
        return ProductsServices.create(newProduct);
      }
    
      static async getById(id) {
        const user = await ToysService.getById(id);
        if (!user) {
          throw new NotFoundException(`Usuario ${id} no encontrado 😱`);
        }
        return user;
      }
      */
}