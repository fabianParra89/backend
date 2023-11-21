import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('chat', {title: 'chat coder'});
})

router.post('/api/messages', (req, res) => {
    const { body } = req;
    newMessageFromAPI(body);
    res.status(201).json({ message: 'Mensaje creado correctamente ❤️‍🔥.'});
  });

export default router;