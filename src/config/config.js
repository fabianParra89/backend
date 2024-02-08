import dotenv from 'dotenv';

dotenv.config();
export default{
    port : process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    jwt_secret: process.env.JWT_SECRET,
    url_base: process.env.URL_BASE + process.env.PORT + '/api',
    clientID: process.env.CLIENT_ID_GITHUB ,
    clientSecret: process.env.CLIENT_SECRET_GITHUB ,
    callbackURL:  process.env.URL_BASE + process.env.PORT + '/api/sessions/github/callback',
    persistence: process.env.PERSISTENCE || "mongoDB",
    env: process.env.ENV || "DES"
};