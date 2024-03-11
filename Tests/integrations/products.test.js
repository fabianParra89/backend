import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testing de Ecommerce', function () {
    before(function () {
        this.cookie = {};
        this.email = '';
    });
    describe('Auth Testing', function () {

        it('deberia registrarse el usuario de forma exitosa', async function () {
            this.email = `pruebaLogin${Date.now() / 1000}@gmail.com`;
            const userMock = {
                first_name: 'prueba',
                last_name: 'login',
                email: this.email,
                password: 'test123',
                age: '34',
                role: 'premium'
            };
            const {
                statusCode,
                ok,
                _body,
            } = await requester.post('/api/auth/register').send(userMock);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('_id');
            expect(_body.password).to.be.not.equal(userMock.password);
        });
        it('deberia loguearse el usuario de forma exitosa', async function () {

            const userMock = {
                email: this.email,
                password: 'test123',
            };
            const {
                headers,
                statusCode,
                ok,
            } = await requester.post('/api/auth/login').send(userMock);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            const [key, value] = headers['set-cookie'][0].split('=');
            this.cookie.key = key;
            this.cookie.value = value;
        });
        it('deberia obtener su informacion el usuario de forma exitosa', async function () {
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .get('/api/auth/current')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('fullname');
            expect(_body).to.be.has.property('email', this.email);
        });
    });

    describe('products testing', function () {
        it('deberia obtener los productos que se encuentran en la base de datos', async function () {
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .get(`/api/products`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            // expect(_body).to.be.has.property('email', this.email);
        });

        it('deberia obtener un producto por su identificador', async function () {
            // console.log(Date.now());
            const productMock = {
                title: "test9",
                description: "bebida",
                price: 5000,
                code: `ent${Date.now()}`,
                status: true,
                stock: 10,
                category: "entrada"
            };

            const { _body: { _id } } = await requester
                .post('/api/products')
                .send(productMock)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .get(`/api/products/${_id}`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body._id).to.be.equal(_id);
            // expect(_body).to.be.has.property('email', this.email);
        });

        it('deberia modificar una propiedad de un producto por su identificador', async function () {
            // console.log(Date.now());
            const productMock = {
                title: "test9",
                description: "bebida",
                price: 5000,
                code: `ent${Date.now()}`,
                status: true,
                stock: 10,
                category: "entrada"
            };

            const { _body: { _id } } = await requester
                .post('/api/products')
                .send(productMock)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);

            const productUpdate = {
                stock: 25,
            }
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .put(`/api/products/${_id}`)
                .send(productUpdate)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(202);
            expect(ok).to.be.ok;
            expect(_body.stock).to.be.equal(productUpdate.stock);
            // expect(_body).to.be.has.property('email', this.email);
        });
        it('deberia eliminar un producto por su identificador', async function () {
            // console.log(Date.now());
            const productMock = {
                title: "test9",
                description: "bebida",
                price: 5000,
                code: `ent${Date.now()}`,
                status: true,
                stock: 10,
                category: "entrada"
            };

            const { _body: { _id } } = await requester
                .post('/api/products')
                .send(productMock)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .delete(`/api/products/${_id}`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('deletedCount', 1);
        });
    });

    describe('carts testing', function () {
        let cid;
        let pid;
        it('deberia crear un carrito de compras', async function () {
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .post(`/api/carts/`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            cid = _body._id;
            expect(statusCode).to.be.equal(201);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('_id');
            expect(_body).to.be.has.property('products');
        });

        it('deberia agregar un producto al carrito de compras por medio del id del producto y el id del carrito', async function () {

            const porducts  = await requester
                .get(`/api/products`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            pid = porducts._body.payload[0]._id;

            const productMock = {
                quantity: 2
            }
            
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .post(`/api/carts/${cid}/product/${pid}`)
                .send(productMock)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('acknowledged');
        });

        it('deberia traer los productos de un carrito de compras por su identificador', async function () {
            console.log('CARTID', cid);
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .get(`/api/carts/${cid}`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body[0]).to.be.has.property('product');
            expect(_body[0]).to.be.has.property('quantity');
            // expect(_body).to.be.has.property('products');
        });
    });
});