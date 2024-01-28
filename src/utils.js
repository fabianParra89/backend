import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import passport from 'passport';

import config from './config/config.js';

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const URL_BASE = config.url_base;
export const JWT_SECRET = config.jwt_secret;

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
  if(!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { role : userRole } = req.user;
  if (userRole !== role) {
    return res.status(403).json({ message: 'No permissions' });
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

