import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';
import {
  createHash,
  isValidPassword,
  generateToken,
  verifyToken,
  authMiddleware,
  authRolesMiddleware,
} from '../../utils.js';

const router = Router();

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'Usuario o contraseña invalidos' });
  }
  const isNotValidPassword = !isValidPassword(password, user);
  if (isNotValidPassword) {
    res.status(401).json({ message: 'Usuario o contraseña invalidos' });
  }
  const token = generateToken(user);
  res.cookie('token', token, {
    maxcAge: 1000 * 60,
    httpOnly: true,
  })
    .status(200).json({ status: 'succes' });
});


router.post('/auth/register', async (req, res) => {

  const {
    body: {
      first_name,
      last_name,
      email,
      password,
      age,
    },
  } = req;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !password
  ) {
    return res.status(400).json({ message: 'Todo los campos son requeridos '});
  }

  let user = await UserModel.findOne({ email });

  if (user) {
    return res.status(400).json({ message: 'Usuario ya registrado'});
  }

  user = await  UserModel.create({
    first_name,
    last_name,
    email,
    password: createHash(password),
    age,
  })

  res.status(200).json(user);

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

router.get('/auth/current', authMiddleware('jwt'), authRolesMiddleware('user'), (req, res) => {
  res.status(200).send(req.user);
});

export default router;