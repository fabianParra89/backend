import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';
import { createHash, isValidPassword } from '../../utils/utils.js'
import { authMiddleware, authRolesMiddleware } from '../../utils/utils.js';
import UserController from "../../controllers/users.controllers.js";
import passport from 'passport';

const router = Router();

router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
  console.log('req.user', req.user);
  res.redirect('/products');
});


router.post('/sessions/register', async (req, res) => {
  try {
    const user = await UserController.create(req.body);
    res.redirect('/login');
  } catch (error) {
    next(error);
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

router.post('/sessions/recovery-password', async (req, res) => {
  const { body: { email, password } } = req;
  if (!email || !password) {
    //return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    return res.render('error', { title: 'Hello People 🖐️', messageError: 'Todos los campos son requeridos.' });
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    //return res.status(401).json({ message: 'Correo o contraseña invalidos.' });
    return res.render('error', { title: 'Hello People 🖐️', messageError: 'Correo o contraseña invalidos.' });
  }
  user.password = createHash(password);
  await UserModel.updateOne({ email }, user);
  res.redirect('/login');
});

router.get('/sessions/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'No estas autenticado.' });
  }
  res.status(200).json(req.session.user);
});

router.get('/session/logout', (req, res) => {
  res.clearCookie('access_token').redirect('/login');
  // req.session.destroy((error) => {
  //   if (error) {
  //     return res.render('error', { title: 'Hello People 🖐️', messageError: error.message });
  //   }
  //   res.redirect('/login');
  // });
})

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  console.log('req.user', req.user);
  res.redirect('/products');
});

export default router;