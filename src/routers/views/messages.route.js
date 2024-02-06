import { Router } from "express";

import { authMiddleware, authRolesMiddleware } from "../../utils/utils.js";

const router = Router();

router.get('/',authMiddleware('jwt'), authRolesMiddleware('user') ,(req, res) => {
    res.render('chat', {title: 'chat coder'});
})

router.post('/api/messages', (req, res) => {
    const { body } = req;
    newMessageFromAPI(body);
    res.status(201).json({ message: 'Mensaje creado correctamente ❤️‍🔥.'});
  });

export default router;