import { Router } from 'express';
import ProductManager from '../../dao/Dao/Products.manager.js';
import { buildResponsePaginated } from '../../utils/utils.js';
import UserModel from '../../dao/models/user.model.js';
import passport from 'passport';
import config from '../../config/config.js';

const router = Router();


router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { limit = 4, page = 1, sort, search } = req.query;
  // sort esta asociado al campo grade. Ademas los posibles valores son asc y desc
  // search esta asociado al campo group
  const criterio = {};
  const options = { limit, page };
  const userSearch = await UserModel.findById(req.user.id);

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
  if (sort) {
    options.sort = { price: sort };
  }
  if (search) {
    criterio.category = search;
  }
  // if (!req.user) {
  //   return res.redirect('/login');
  // }
  
  const result = await ProductManager.get(criterio, options);
  const baseUrl = `http://localhost:${config.port}`;
  const data = buildResponsePaginated({ ...result, sort, search }, baseUrl);
  res.render('products', { title: 'Coder House Admin', ...data, user: user });
});



export default router;