import { UserDao, CartDao, ProductDao, TicketDao } from "../dao/factory.js";

import UsersRepository from './users.repository.js';
import CartsRepository from './carts.repository.js';
import ProductsRepository from './products.repository.js';
import TicketsRepository from './tickets.repository.js';


export const usersRepository = new  UsersRepository(UserDao);
export const cartsRepository = new  CartsRepository(CartDao);
export const productsRepository = new  ProductsRepository(ProductDao);
export const ticketsRepository = new TicketsRepository(TicketDao);


