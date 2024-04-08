import { Router } from 'express';
import { buildResponsePaginated } from '../../utils/utils.js';
import config from '../../config/config.js';
import UserController from "../../controllers/users.controllers.js";
import { authMiddleware, authRolesMiddleware } from '../../utils/utils.js';
import UsersDTO from '../../dto/users.dto.js'

const router = Router();


router.get('/users', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res, next) => {
  try {
    const users = await UserController.getAll({});
    const userSearch = await UserController.getById(req.user.id);

    if (!userSearch) {
      return res.redirect('/login');
    }

    let {
      first_name,
      last_name,
      email,
      age,
      role,
    } = userSearch;

    const user = {
      first_name,
      last_name,
      email,
      age,
      role,
    };

    const usersDTO = new UsersDTO(users);
    // console.log('usersDTO', usersDTO);
    res.render('users', { title: 'Usuarios Ecommerce', ...usersDTO, user: user });
    // res.status(200).json(usersDTO);
  } catch (error) {
    next(error);
  }
});

router.get('/changeRol/:uid', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res, next) => {
  try {

    const { params: { uid } } = req;
    const user = await UserController.updateRoleById(uid);
    res.redirect('/users');
    // res.render('users', { title: 'Usuarios Ecommerce', ...usersDTO, user: user });
    // res.status(200).json(usersDTO);
  } catch (error) {
    next(error);
  }
});

router.get('/deleteUser/:uid', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res, next) => {
  try {

    const { params: { uid } } = req;
    const user = await UserController.deleteById(uid);
    res.redirect('/users');
    // res.render('users', { title: 'Usuarios Ecommerce', ...usersDTO, user: user });
    // res.status(200).json(usersDTO);
  } catch (error) {
    next(error);
  }
});

export default router;