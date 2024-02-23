import EmailService from "../services/email.service.js";

import { CustomError } from "../utils/CustomError.js";
import { sendEmailInvalid, sendEmailNotFound, newPassInvalid, tokenExpired } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";
import { logger } from "../config/logger.js";
import UsersService from '../services/user.service.js';
import { generateTokenRecovery, isValidPassword, createHash } from "../utils/utils.js";
import config from "../config/config.js";


export default class MailManager {

  static async emailRecovery(email) {

    if (!email) {
      CustomError.create(
        {
          name: 'No ingreso Email',
          cause: sendEmailInvalid(),
          message: 'No se ingreso ningun email',
          code: EnumsError.INVALID_PARAMS_ERROR,
        }
      )
      logger.error('No se ingreso ningun email');
      //return res.status(400).json({ message: 'Todos los campos son requeridos.' });
      // return res.render('error', { title: 'Hello People 🖐️', messageError: 'Todos los campos son requeridos.' });
    }
    const user = await UsersService.getByEmail(email);
    if (!user) {
      CustomError.create(
        {
          name: 'usuario no existe',
          cause: sendEmailNotFound(),
          message: 'No existe el email en el sistema',
          code: EnumsError.INVALID_PARAMS_ERROR,
        }
      )
      logger.error(`No existe la cuenta ${email}  en el sistema`);
      //return res.status(401).json({ message: 'Correo o contraseña invalidos.' });
      // return res.render('error', { title: 'Hello People 🖐️', messageError: 'Correo o contraseña invalidos.' });
    }

    const token = generateTokenRecovery(email);
    const linkRecovery = `${config.url_base_recovery}/page-recoveryPass?token=${token}`;
    const emailService = EmailService.getInstance();
    const result = await emailService.sendEmail(
      email,
      'Hola, desde nuestro servidor en Node js v2',
      `<!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Recuperación de Contraseña</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
            
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            
                h2 {
                  color: #333;
                }
            
                p {
                  color: #666;
                }
            
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  font-size: 16px;
                  text-decoration: none;
                  color: #fff;
                  background-color: #007BFF;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
            
              <div class="container">
                <h2>Recuperación de Contraseña</h2>
                <p>Hola [Nombre del Usuario],</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el enlace a continuación para proceder con el restablecimiento:</p>
            
                <a style=" display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                text-decoration: none;
                color: #fff;
                background-color: #007BFF;
                border-radius: 5px;" href=${linkRecovery}>Retablecer contraseña</a>
            
                <p>Si no solicitaste este restablecimiento de contraseña, puedes ignorar este correo.</p>
                <p>Gracias,<br>El Equipo de Soporte</p>
              </div>
            
            </body>
            </html>
            `,
    );
    return result
  }

  static async changePass(payload, body) {
    if (!payload) {
      CustomError.create(
        {
          name: 'Expiro token',
          cause: tokenExpired(),
          message: 'El token expiro',
          code: EnumsError.TOKEN_EXPIRED,
        }
      )
      logger.error('El token expiro')
    }
    const user = await UsersService.getByEmail(payload.mail);
    const passwordValid = isValidPassword(body.newPass, user);
    if (passwordValid) {
      CustomError.create(
        {
          name: 'contraseña nueva invalida',
          cause: newPassInvalid(),
          message: 'La contraseña nueva ya fue utilizada anteriormente',
          code: EnumsError.INVALID_PARAMS_ERROR,
        }
      )
      logger.error('La contraseña nueva ya fue utilizada anteriormente')
    }
    
    console.log('user', user);
    user.password = createHash(body.newPass);
    return  await UsersService.updateById(user._id, user);

  }
}
