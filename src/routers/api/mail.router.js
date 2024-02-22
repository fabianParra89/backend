import { Router } from 'express';

import EmailService from "../../services/email.service.js";
import MailController from '../../controllers/mailRecovery.controller.js';
import { verifyTokenRecovery } from "../../utils/utils.js";

const router = Router();


router.post('/mailRecovery', async (req, res, next) => {
    try {
        const { body } = req;
        console.log('email', body.email);

        const sendEmailRecovery =  await MailController.emailRecovery(body.email);
        res.status(200)
        .render ('error', { title: 'email enviado 🖐️', messageError: 'email enviado' });
    } catch (error) {
        res.render('error', { title: 'error 🖐️', messageError: error });
    }    
});

router.post('/changePass', async (req, res, next) => {
    try {
        const { body } = req;
        const { query } = req;        
        const payload = await verifyTokenRecovery(query.token);
        console.log(payload);
        const changePass = await MailController.changePass(payload, body);
        console.log(changePass);
        res.status(200)
        .render('error', { title: 'error 🖐️', messageError: 'Contarseña cambiada exitosamente' });
    } catch (error) {
        res.render('error', { title: 'error 🖐️', messageError: error.message });
    }    
});


export default router;