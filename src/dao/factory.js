import config from '../config/config.js';

export let ProductDao;
export let CartDao;
export let UserDao;
export let TicketDao;

switch (config.persistence) {
  case 'mongoDB':
    // --const connection = mongoose.connect(config.mongodbUri);
    const ProductDaoMongoDb = (await import('./product.mongoDB.dao.js')).default;
    ProductDao = new ProductDaoMongoDb();
    const CartDaoMongoDb = (await import('./cart.mongoDB.dao.js')).default;
    CartDao = new CartDaoMongoDb();
    const UserDaoMongoDb = (await import('./user.mongoDB.dao.js')).default;
    UserDao = new UserDaoMongoDb();
    const TicketDaoMongoDb = (await import('./ticket.mongoDB.dao.js')).default;
    TicketDao = new TicketDaoMongoDb();
    break;
  // default:
  //   const ContactDaoMemory = (await import('./contact.memory.dao.js')).default;
  //   contactDao = new ContactDaoMemory();
  //   break;
}