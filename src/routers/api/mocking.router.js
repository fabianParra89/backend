import { Router } from "express";
import { generateProducts } from "../../utils/utils.js";
// import router from "./products.router.js";

const router=Router();

router.get('/mockingproducts', (req, res) =>{
    const products = generateProducts();
    res.status(200).json(products);
});

export default router;
