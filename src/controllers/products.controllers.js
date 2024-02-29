import ProductsServices from "../services/product.service.js";
import { CustomError } from "../utils/CustomError.js";
import { productIdError, generatorProductCodeError, generatorProductError, permissionsError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";
import { logger } from "../config/logger.js";

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

  static async create(data, user) {
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
      logger.error('Error al intentar crear el producto, codigo de producto ya existe')
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
      logger.error('Error,Informacion del producto invalida');
      // throw new InvalidDataException('Todos los campos son requidos 😱');
    }

    (user.role === "premium") ? data.owner = user.id : data.owner = "admin";
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
      logger.info('Error al obtener el producto por su id');
    }
    await ProductsServices.updateById(pid, data);
    return await ProductsServices.getById(pid)
    
  }

  static async deleteById(pid, user) {
    const prodcut = await ProductsServices.getById(pid);
    if(!(prodcut.owner === 'admin' || prodcut.owner === user.id || user.role === 'admin' )){ 
      CustomError.create(
        {
          name: 'Permisos denegados',
          cause: permissionsError(),
          message: 'Error, usuario sin permisos',
          code: EnumsError.FORBIDDEN_ERROR,
        }
      )
      logger.info('Error, usuario sin permisos');
    }

    if (!prodcut) {
      CustomError.create(
        {
          name: 'id de producto invalido',
          cause: productIdError(pid),
          message: 'Error al obtener el producto por su id',
          code: EnumsError.INVALID_PARAMS_ERROR,
        }
      )
      logger.info('Error al obtener el producto por su id');

    }
    return await ProductsServices.deleteById(pid);
  }
}