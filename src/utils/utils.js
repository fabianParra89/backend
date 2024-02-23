import path, {join} from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import passport from 'passport';
import { faker } from '@faker-js/faker';

import config from '../config/config.js';
import { CustomError } from "../utils/CustomError.js";
import { UnauthorizedError, permissionsError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";

// const __filename = url.fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);

const __filename = url.fileURLToPath(import.meta.url);
export const baseDir = path.dirname(__filename);
export const __dirname = join(baseDir, '..');

export const URL_BASE = config.url_base;
export const JWT_SECRET = config.jwt_secret;
export const JWT_SECRET_RECOVERY = config.jwt_secret_recovery;

export const buildResponsePaginated = (data, baseUrl = URL_BASE) => {
  const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, sort, limit, search } = data
  return {
    //status:success/error
    status: 'success',
    //payload: Resultado de los productos solicitados
    payload: docs.map((doc) => doc.toJSON()),
    //totalPages: Total de páginas
    totalPages: totalPages,
    //prevPage: Página anterior
    prevPage: prevPage,
    //nextPage: Página siguiente
    nextPage: nextPage,
    //page: Página actual
    page: page,
    //hasPrevPage: Indicador para saber si la página previa existe
    hasPrevPage: hasPrevPage,
    //hasNextPage: Indicador para saber si la página siguiente existe.
    hasNextPage: hasNextPage,
    //prevLink: Link directo a la página previa (null si hasPrevPage=false)
    prevLink: hasPrevPage ? `${baseUrl}/products/?limit=${limit}&page=${prevPage}${sort ? `&sort=${sort}` : ''}${search ? `&search=${search}` : ''}` : null,
    //nextLink: Link directo a la página siguiente (null si hasNextPage=false)
    nextLink: hasNextPage ? `${baseUrl}/products/?limit=${limit}&page=${nextPage}${sort ? `&sort=${sort}` : ''}${search ? `&search=${search}` : ''}` : null,
  };
};

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    cartId: user.cartId,
  };
  return JWT.sign(payload, JWT_SECRET, { expiresIn: '30m' });

};

export const generateTokenRecovery = (mail) => {
  const payload = {
    mail: mail
  };
  return JWT.sign(payload, JWT_SECRET_RECOVERY, { expiresIn: '1m' });

};

export const verifyToken = (token) => {
  return new Promise((resolve) => {
    JWT.verify(token, JWT_SECRET, (error, payload) => {
      if (error) {
        return resolve(false);
      }
      resolve(payload);
    });
  });
};

export const verifyTokenRecovery = (token) => {
  return new Promise((resolve) => {
    JWT.verify(token, JWT_SECRET_RECOVERY, (error, payload) => {
      if (error) {
        return resolve(false);
      }
      resolve(payload);
    });
  });
};

export const authMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, payload, info) {
    if (error) {
      return next(error);
    }
    if (!payload) {
      return res.status(401).json({ message: info.message ? info.message : info.toString() });
    }
    req.user = payload;
    next();
  })(req, res, next);
};

export const authRolesMiddleware = (role) => (req, res, next) => {
  if (!req.user) {
    CustomError.create(
      {
        name: 'Unauthorized',
        cause: UnauthorizedError(),
        message: 'Error con credeciales de ingreso',
        code: EnumsError.UNAUTHORIZED_ERROR,
      }
    )
    // return res.status(401).json({ message: 'Unauthorized' });
  }
  const { role: userRole } = req.user;
  // if (userRole !== role) {
  if (  !role.includes(userRole)) {
    CustomError.create(
      {
        name: 'Permisos denegados',
        cause: permissionsError(),
        message: 'Error, usuario sin permisos',
        code: EnumsError.FORBIDDEN_ERROR,
      }
    )
    // return res.status(403).json({ message: 'No permissions' });
  }
  next();
};

export class Exception extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class InvalidDataException extends Exception {
  constructor(message) {
    super(message, 400);
  }
}

export class NotFoundException extends Exception {
  constructor(message) {
    super(message, 404);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message) {
    super(message, 401);
  }
}

export class ForbiddenException extends Exception {
  constructor(message) {
    super(message, 403);
  }
}



export const generateProducts = () => {
  let products = [];
  let product = {};
  for (let index = 0; index < 100; index++) {

    product = {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      price: faker.commerce.price(),
      thumbnail: faker.image.url(),
      code: faker.string.alphanumeric({ length: 6 }),
      stock: faker.number.int({ min: 1, max: 200 }),
      status: faker.datatype.boolean(),
      category: faker.commerce.department(),
    }
    products.push(product);

  }
  return products
  // {
  //   id: faker.database.mongodbObjectId(),
  //   title: faker.commerce.productName(),
  //   description: faker.lorem.paragraph(),
  //   price: faker.commerce.price(),
  //   thumbnail: faker.image.url(),
  //   code: faker.string.alphanumeric({ length: 6 }),
  //   stock: faker.number.int({ min: 10000, max: 99999 }),
  //   status: faker.datatype.boolean(),
  //   category: faker.commerce.department(),
  // }
};


