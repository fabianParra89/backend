import mongoose from 'mongoose';

import config from '../config/config.js'

export const URI = config.mongodbUri;
// const URI = 'mongodb://localhost:27017/school';

export const initDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database connected susscessfully 🚀');
  } catch (error) {
    console.error('Ocurrio un error al intenter conectarnos a la base de datos 😨');
  }
}
