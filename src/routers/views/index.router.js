import { Router } from 'express';

import ProductManager from '../../dao/Dao/productManager.js';
import ProductManagerDB from '../../dao/Dao/Products.manager.js';
import EmailService from "../../services/email.service.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('login', { title: 'Hello People 🖐️' });
});

router.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.render('profile', { title: 'Hello People 🖐️', user: req.user.toJSON() });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Hello People 🖐️' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Hello People 🖐️' });
});

router.get('/recovery-password', (req, res) => {
    res.render('recovery-password', { title: 'Recovery Password 🖐️' });
});

router.get('/page-recoveryPass', (req, res) => {
    res.render('page-recoveryPass', { title: 'Recovery Page Password 🖐️' });
});

router.get('/mail', async (req, res) => {
    const emailService = EmailService.getInstance();
    const result = await emailService.sendEmail(
        'fabi_8931@hotmail.com',
        'Hola, desde nuestro servidor en Node js v2',
        `<div>
        <h1>Hola Coder House 😍</h1>
        <img src="cid:hello-cat" alt="Hello" />
      </div>`,
    );
    res.status(200).json(result);
});

export default router;


