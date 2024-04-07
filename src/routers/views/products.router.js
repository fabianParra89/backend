import { Router } from 'express';
import ProductManager from '../../dao/Dao/Products.manager.js';
import CartsControllers from "../../controllers/carts.controllers.js";
import UserController from "../../controllers/users.controllers.js";
import { buildResponsePaginated } from '../../utils/utils.js';
import passport from 'passport';
import config from '../../config/config.js';

const router = Router();


router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { limit = 4, page = 1, sort, search } = req.query;
  // sort esta asociado al campo grade. Ademas los posibles valores son asc y desc
  // search esta asociado al campo group
  const criterio = {};
  let viewCart = {};
  const options = { limit, page };
  // const userSearch = await UserModel.findById(req.user.id);
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
      cartId
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

  if (cartId.length > 0) {
    viewCart.cid = cartId[0].cartId;
    viewCart.renderViewCart = true; 
    const products = await CartsControllers.getProductsCartsById(cartId[0].cartId);
    const arrayQuantity = products.map((product)=>{
      return product.quantity
    })

    const sumaQuantity = arrayQuantity.reduce((acumulador, elementoActual) => {
      return acumulador + elementoActual;
    }, 0);
    viewCart.sumaProductsCart = sumaQuantity;
    // console.log('arrayQuantity', sumaQuantity);
    // console.log('vista de productos in cart', products);
  } else{
    viewCart.renderViewCart = false; 
  }
   
  
  const admin  = (role === 'admin') ? true: false;
  const result = await ProductManager.get(criterio, options);
  const baseUrl = `http://localhost:${config.port}`;
  const data = buildResponsePaginated({ ...result, sort, search }, baseUrl);
  res.render('products', { title: 'Coder House Admin', ...data, user: user, admin: admin, cart: viewCart });
});



export default router;