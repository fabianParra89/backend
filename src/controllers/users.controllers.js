import UsersService from '../services/user.service.js';
import { createHash, InvalidDataException, NotFoundException, UnauthorizedException,isValidPassword } from '../utils.js';

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
            throw new UnauthorizedException(`Usuario o contraseña invalidos`);
        }
        const isNotValidPassword = !isValidPassword(password, user);
        if (isNotValidPassword) {
            throw new UnauthorizedException(`Usuario o contraseña invalidos`);
        }
        return user
    }

    static async create(data) {
        const {           
              first_name,
              last_name,
              email,
              password,
              age
            } = data;
      
          if (!first_name || !last_name || !email || !password) {
            throw new InvalidDataException(`Todos los campos son requeridos.`);
            //return res.status(400).render('error', { title: 'Hello People 🖐️', messageError: 'Todos los campos son requeridos.' });
            //return res.status(400).json({ message: 'Todo los campos son requeridos ' });
          }
      
          let user = await UsersService.getByEmail(email);
      
          if (user) {
            throw new InvalidDataException(`Usuario ya registrado.`);
            //return res.status(400).render('error', { title: 'Hello People 🖐️', messageError: 'Usuario ya registrado.' });
            //return res.status(400).json({ message: 'Usuario ya registrado' });
          }
      
          const newUser = await UsersService.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
          })
      
        return UsersService.create(newUser);
    }

    static async getById(id) {
        const user = await UsersService.getById(id);
        if (!user) {
            throw new NotFoundException(`Usuario ${id} no encontrado 😱`);
        }
        return user;
    }

    static async updateById(id, data) {
        await UserController.getById(id);
        return UsersService.updateById(id, data);
    }

    static async deleteById(id) {
        await UserController.getById(id);
        return UsersService.deleteById(id);
    }
}