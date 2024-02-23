import UsersService from '../services/user.service.js';
import { createHash, isValidPassword } from '../utils/utils.js';

import { CustomError } from "../utils/CustomError.js";
import { credentialUserError, generatorUserError, generatorUserEmailError, userIdError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";

export default class UserController {
    static getAll(filter = {}) {
        return UsersService.getAll(filter);
    }

    static getByEmail(email) {
        return UsersService.getByEmail(email);
    }


    static async login(data) {
        const { email, password } = data;
        const user = await UsersService.getByEmail(email);
        if (!user) {
            CustomError.create(
                {
                    name: 'credenciales invalidas',
                    cause: credentialUserError(),
                    message: 'Error de credenciales al intentar ingresar',
                    code: EnumsError.UNAUTHORIZED_ERROR,
                }
            )
            // throw new UnauthorizedException(`Usuario o contraseña invalidos`);
        }
        const isNotValidPassword = !isValidPassword(password, user);
        if (isNotValidPassword) {
            CustomError.create(
                {
                    name: 'credenciales invalidas',
                    cause: credentialUserError(),
                    message: 'Error de credenciales al intentar ingresar',
                    code: EnumsError.INVALID_PARAMS_ERROR,
                }
            )
            // throw new UnauthorizedException(`Usuario o contraseña invalidos`);
        }
        return user
    }

    static async create(data) {
        const {
            first_name,
            last_name,
            email,
            password,
            age,
            role
        } = data;

        if (!first_name || !last_name || !email || !password) {
            CustomError.create(
                {
                    name: 'Informacion del usuario invalida',
                    cause: generatorUserError(data),
                    message: 'Error al intentar crear un nuevo usuario',
                    code: EnumsError.BAD_REQUEST_ERROR,
                }
            )
            // throw new InvalidDataException(`Todos los campos son requeridos.`);
            //return res.status(400).render('error', { title: 'Hello People 🖐️', messageError: 'Todos los campos son requeridos.' });
            //return res.status(400).json({ message: 'Todo los campos son requeridos ' });
        }

        let user = await UsersService.getByEmail(email);

        if (user) {
            CustomError.create(
                {
                    name: 'Usuario ya existe',
                    cause: generatorUserEmailError(email),
                    message: 'Error al intentar crear un nuevo usuario',
                    code: EnumsError.BAD_REQUEST_ERROR,
                }
            )

            // throw new InvalidDataException(`Usuario ya registrado.`);
            //return res.status(400).render('error', { title: 'Hello People 🖐️', messageError: 'Usuario ya registrado.' });
            //return res.status(400).json({ message: 'Usuario ya registrado' });
        }

        const newUser = await UsersService.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role,
        })

        return UsersService.create(newUser);
    }

    static async getById(id) {
        const user = await UsersService.getById(id);
        if (!user) {
            CustomError.create(
                {
                    name: 'Usuario no existe',
                    cause: userIdError(id),
                    message: 'Error al intentar buscar un usuario por id',
                    code: EnumsError.NOT_FOUND_ERROR,
                }
            )
            // throw new NotFoundException(`Usuario ${id} no encontrado 😱`);
        }
        return user;
    }

    static async updateById(id) {
        const user = await UsersService.getById(id);
        if (!user) {
            CustomError.create(
                {
                    name: 'Usuario no existe',
                    cause: userIdError(id),
                    message: 'Error al intentar buscar un usuario por id',
                    code: EnumsError.NOT_FOUND_ERROR,
                }
            )
        }

        (user.role === 'premium') ? user.role = 'user' : user.role = 'premium';
        await UsersService.updateById(id, user);
        return await UsersService.getById(id);
    }

    static async deleteById(id) {
        await UserController.getById(id);
        return UsersService.deleteById(id);
    }
}