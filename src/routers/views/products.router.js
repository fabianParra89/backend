import { Router } from 'express';
import ProductManager from '../../dao/Dao/Products.manager.js';
import { buildResponsePaginated } from '../../utils.js';

const router = Router();


router.get('/products', async (req, res) => {
  const { limit = 4, page = 1, sort, search } = req.query;
  // sort esta asociado al campo grade. Ademas los posibles valores son asc y desc
  // search esta asociado al campo group
  const criterio = {};
  const options = { limit, page };
  if (sort) { 
    options.sort = { price: sort };
  }
  if (search) {
    criterio.category = search;
  }
  const result = await ProductManager.get(criterio, options);
  const baseUrl = 'http://localhost:8080';
  const data = buildResponsePaginated({ ...result, sort, search }, baseUrl);
  res.render('products', { title: 'Coder House Admin', ...data });
});



export default router;