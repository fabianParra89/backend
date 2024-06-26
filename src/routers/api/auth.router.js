import { Router } from 'express';

import UserController from "../../controllers/users.controllers.js";
import UserDTO from '../../dto/user.dto.js';
import UsersDTO from '../../dto/users.dto.js';

import { generateToken, verifyToken, authMiddleware, authRolesMiddleware } from '../../utils/utils.js';


const router = Router();

router.get('/auth/users', authMiddleware('jwt'), async (req, res, next) => {
  try {
    const users = await UserController.getAll({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/auth/users/:userEmail', async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    const users = await UserController.getByEmail(userEmail);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});


router.post('/auth/login', async (req, res, next) => {
  try {
    const user = await UserController.login(req.body);
    const token = generateToken(user);
    res.cookie('token', token, {
      maxAge: 30000 * 60,
      httpOnly: true,
    })
      .status(200)
      // .json({ status: 'succes' })
      .redirect('/products');
  } catch (error) {
    next(error)
  }

});


router.post('/auth/register', async (req, res, next) => {
  try {
    const user = await UserController.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});


router.get('/auth/current', authMiddleware('jwt'), authRolesMiddleware(['user', 'premium', 'admin']), async (req, res) => {
  const user = await UserController.getById(req.user.id);
  const userDTO = new UserDTO(user);
  res.status(200).json(userDTO);
  // res.status(200).send(user);
});

router.get('/auth/logout', authMiddleware('jwt'), async (req, res) => {
  await UserController.logOut(req.user.id);
  res.clearCookie('token').redirect('/login');
  
})

router.put('/users/premium/:uid', authMiddleware('jwt'), authRolesMiddleware(['admin']),  async (req, res, next) => {
  try {
    const { params: { uid } } = req;
    const user = await UserController.updateRoleById(uid);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/users', authMiddleware('jwt'), async (req, res, next) => {
  try {
    const users = await UserController.getAll({});
    const usersDTO = new UsersDTO(users);
    res.status(200).json(usersDTO);
  } catch (error) {
    next(error);
  }
});

router.delete('/users' , authMiddleware('jwt'), async (req, res, next) => {
  try {
      const usersDelete = await UserController.deleteByInactivity();
      res.status(200).json(usersDelete);
  } catch (error) {
      next(error);
  }

});

router.post('/users/updateUser/:uid', async (req, res, next) => {
  try {
    const { params: { uid } } = req;
    const user = await UserController.updateById(uid, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

export default router;