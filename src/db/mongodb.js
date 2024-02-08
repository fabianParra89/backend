import mongoose from 'mongoose';

import config from '../config/config.js'
import { logger } from "../config/logger.js";

export const URI = config.mongodbUri;
// const URI = 'mongodb://localhost:27017/school';

export const initDB = async () => {
  try {
    await mongoose.connect(URI);
    logger.info('Database connected susscessfully 🚀');
    // console.log('Database connected susscessfully 🚀');
  } catch (error) {
    logger.fatal('Ocurrio un error al intenter conectarnos a la base de datos 😨');
  }
}
