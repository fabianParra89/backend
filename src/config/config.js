import dotenv from 'dotenv';

dotenv.config();
export default{
    port : process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    jwt_secret: process.env.JWT_SECRET,
    jwt_secret_recovery: process.env.JWT_SECRET_RECOVERY,
    // url_base: process.env.URL_BASE + process.env.PORT + '/api',
    url_base: process.env.URL_BASE  + '/api',
    url_base_recovery: process.env.URL_BASE + process.env.PORT,
    clientID: process.env.CLIENT_ID_GITHUB ,
    clientSecret: process.env.CLIENT_SECRET_GITHUB ,
    callbackURL:  process.env.URL_BASE + process.env.PORT + '/api/sessions/github/callback',
    persistence: process.env.PERSISTENCE || "mongoDB",
    env: process.env.ENV || "DES",
    mail: {
        emailService: process.env.EMAIL_SERVICE || 'gmail',
        emailPort: process.env.EMAIL_PORT || 587,
        emailUser: process.env.EMAIL_USER,
        emailPassword: process.env.EMAIL_PASSWORD,
      },
};