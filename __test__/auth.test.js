'use strict';

process.env.SECRET = "smallProjectTest";
const supertest = require('supertest');
const server = require('../src/server').server;
const { db } = require('../src/models/index');
const mockRequest = supertest(server);
let users = {
    owner: { username: 'owner', password: 'password', role: 'owner',phone:"07805555",Adress:"jgjgg" },
    customer: { username: 'customer', password: 'password', role: 'customer',phone:"07805555",Adress:"jgjgg" },

};

beforeAll(async () => {
    await db.sync();
});
afterAll(async () => {
    await db.drop();
});

describe('Auth Router', () => {
    Object.keys(users).forEach(userType => {
        // << Checking happy scenarios (hopefully) >>:
        describe(`${userType} users`, () => {
            it('can create one', async () => {
                const response = await mockRequest.post('/signup').send(users[userType]);
                const userObject = response.body;
                expect(response.status).toBe(201);
                expect(userObject.id).toBeDefined();
                expect(userObject.username).toEqual(users[userType].username);
                expect(userObject.role).toEqual(users[userType].role);
            });

            it('can sign-in with basic header', async () => {
                const response = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const userObject = response.body;
                expect(response.status).toBe(200);
                expect(userObject.token).toBeDefined();
                expect(userObject.id).toBeDefined();
                expect(userObject.username).toEqual(users[userType].username);
                expect(userObject.role).toEqual(users[userType].role);
            });

        
        });
    });

    // << Checking bad scenarios >>:
    describe('bad logins', () => {
     
        it('Bad Auth scenario 1 - bearer fails with an invalid token (Bearer Auth)', async () => {
            const bearerResponse = await mockRequest.get('/secret').set('Authorization', 'Bearer foobar');
            expect(bearerResponse.status).not.toBe(200);
        });
    });
});