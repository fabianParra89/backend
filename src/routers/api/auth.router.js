import { Router } from 'express';

import UserController from "../../controllers/users.controllers.js";
import UserDTO from '../../dto/user.dto.js';

import { generateToken, verifyToken, authMiddleware, authRolesMiddleware } from '../../utils.js';


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
      maxAge: 1000 * 60,
      httpOnly: true,
    })
      .status(200)
      .json({ status: 'succes' })
      //.redirect('/products');
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

// const jwtAuth = async (req, res, next) => {
//   //const { headers: { authorization: token } } = req;
//   const { token } = req.cookies;
//   console.log('token', token);
//   if (!token) {
//     res.status(401).json({ message: 'No tienes permiso para estar aca.' });
//   }

//   const payload = await verifyToken(token);

//   if (!payload) {
//     res.status(401).json({ message: 'No tienes permiso para estar aca.' });
//   } else {
//     req.user = payload;
//     next();
//   }

// };

router.get('/auth/current', authMiddleware('jwt'), authRolesMiddleware('user'), async (req, res) => {
  const user = await UserController.getById(req.user.id);
  const userDTO = new UserDTO(user);
  res.status(200).json(userDTO);
  // res.status(200).send(user);
});

router.get('/auth/logout', (req, res) => {
  res.clearCookie('access_token').redirect('/login');
  
})

export default router;