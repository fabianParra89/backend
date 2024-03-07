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
                role: 'user'
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
                .get('/api/products')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            // expect(_body).to.be.has.property('email', this.email);
        });
        
    });
});