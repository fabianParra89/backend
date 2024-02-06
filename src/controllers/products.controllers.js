import ProductsServices from "../services/product.service.js";
import { CustomError } from "../utils/CustomError.js";
import { productIdError, generatorProductCodeError, generatorProductError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";

export default class ProductsController {
  static getAll(criterio, options) {
    return ProductsServices.getAll(criterio, options);
  }

  static async getById(pid) {
    const prodcut = await ProductsServices.getById(pid);
    if (!prodcut) {
      CustomError.create(
        {
          name: 'id de producto invalido',
          cause: productIdError(pid),
          message: 'Error al obtener el producto por su id',
          code: EnumsError.INVALID_PARAMS_ERROR,
        }
      )
      // throw new NotFoundException(`producto ${pid} no encontrado 😱`);
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
      CustomError.create(
        {
          name: 'codigo de producto existente',
          cause: generatorProductCodeError(code),
          message: 'Error al intentar crear el producto',
          code: EnumsError.BAD_REQUEST_ERROR,
        }
      )
      // throw new InvalidDataException(`producto con codigo ${code} ya existe 😱`);
    }

    if (!title || !description || !price || !code || !stock || !status || !category) {
      CustomError.create(
        {
          name: 'Informacion del producto invalida',
          cause: generatorProductError(data),
          message: 'Error al intentar crear un nuevo producto',
          code: EnumsError.BAD_REQUEST_ERROR,
        }
      )
      // throw new InvalidDataException('Todos los campos son requidos 😱');
    }

    return await ProductsServices.create(data);
  }

  static async updateById(pid, data) {
    const prodcut = await ProductsServices.getById(pid);
    if (!prodcut) {
      CustomError.create(
        {
          name: 'id de producto invalido',
          cause: productIdError(pid),
          message: 'Error al obtener el producto por su id',
          code: EnumsError.INVALID_PARAMS_ERROR,
        }
      )
      // throw new NotFoundException(`producto ${pid} no encontrado 😱`);
    }
    return await ProductsServices.updateById(pid, data);
  }

  static async deleteById(pid) {
    const prodcut = await ProductsServices.getById(pid);
    if (!prodcut) {
      CustomError.create(
        {
          name: 'id de producto invalido',
          cause: productIdError(pid),
          message: 'Error al obtener el producto por su id',
          code: EnumsError.INVALID_PARAMS_ERROR,
        }
      )
      // throw new NotFoundException(`producto ${pid} no encontrado 😱`);
    }
    return await ProductsServices.deleteById(pid);
  }
}