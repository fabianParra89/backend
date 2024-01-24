import config from '../config/config.js';

export let ProductDao;
export let CartDao;
export let UserDao;

switch (config.persistence) {
  case 'mongoDB':
    // --const connection = mongoose.connect(config.mongodbUri);
    const ProductDaoMongoDb = (await import('./product.mongoDB.dao.js')).default;
    ProductDao = new ProductDaoMongoDb();
    const CartDaoMongoDb = (await import('./cart.mongoDB.dao.js')).default;
    CartDao = new CartDaoMongoDb();
    const UserDaoMongoDb = (await import('./user.mongoDB.dao.js')).default;
    console.log('claseUser', UserDaoMongoDb);
    UserDao = new UserDaoMongoDb();
    console.log('claseUser', UserDao);
    break;
  // default:
  //   const ContactDaoMemory = (await import('./contact.memory.dao.js')).default;
  //   contactDao = new ContactDaoMemory();
  //   break;
}