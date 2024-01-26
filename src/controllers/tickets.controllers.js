import TicketsServices from "../services/ticket.service.js";
import { InvalidDataException, NotFoundException } from "../utils.js";
import { v4 as uuidV4 } from "uuid";

export default class TicketsController {
    // static getAll(criterio, options) {
    //     return ProductsServices.getAll(criterio, options);
    // }

    // static async getById(pid) {
    //     const prodcut = await ProductsServices.getById(pid);
    //     if (!prodcut) {
    //         throw new NotFoundException(`producto ${pid} no encontrado 😱`);
    //     }
    //     return prodcut;
    // }

    static async create(data) {
        console.log(data);

        const {
            amount,
            purchaser,
            purchaser_datetime,
        } = data
        
        // const productByCode = await ProductsServices.getByCode(code);

        // if (productByCode) {
        //     throw new InvalidDataException(`producto con codigo ${code} ya existe 😱`);
        // }
        if (!amount || !purchaser || !purchaser_datetime ) {
            throw new InvalidDataException('Todos los campos son requidos 😱');
        }
        const newData = {
            code: uuidV4(),
            amount,
            purchaser,
            purchaser_datetime,
        }

        return await TicketsServices.create(newData);
    }

    // static async updateById(pid, data) {
    //     const prodcut = await ProductsServices.getById(pid);
    //     if (!prodcut) {
    //         throw new NotFoundException(`producto ${pid} no encontrado 😱`);
    //     }
    //     return await ProductsServices.updateById(pid, data);
    // }

    // static async deleteById(pid) {
    //     const prodcut = await ProductsServices.getById(pid);
    //     if (!prodcut) {
    //         throw new NotFoundException(`producto ${pid} no encontrado 😱`);
    //     }
    //     return await ProductsServices.deleteById(pid);
    // }

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