'use strict';

process.env.SECRET = "smallProjectTest";
const supertest = require('supertest');
const server = require('../src/server').server;
const { db } = require('../src/models/index');
const middleware = require('../src/auth/middleware/basickauth')
const mockRequest = supertest(server);
let users = {
    owner: { username: 'owner', password: 'password', role: 'owner', phone: "07805555", Adress: "jgjgg" },
    driver: { username: 'driver', password: 'password', role: 'driver', phone: "07805555", Adress: "jgjgg" },
    customer: { username: 'customer', password: 'password', role: 'customer', phone: "07805555", Adress: "jgjgg" },

};


beforeAll(async () => {
    await db.sync();
});
afterAll(async () => {
    await db.drop();
});
let token = {}
describe('Auth Router', () => {
    Object.keys(users).forEach(userType => {
        // << Checking happy scenarios (hopefully) >>:
        describe(`${userType} users`, () => {



            it('can create one', async () => {
                const response = await mockRequest.post('/signup').send(users[userType]);
                const userObject = response.body;
                token[userType] = userObject.token;
                expect(response.status).toBe(201);
                expect(userObject.id).toBeDefined();
                expect(userObject.username).toEqual(users[userType].username);
                expect(userObject.role).toEqual(users[userType].role);
            });

            it('can sign-in with basic header', async () => {
                const response = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const userObject = response.body;
                console.log(userObject, 'back from test 2')
                expect(response.status).toBe(200);
                expect(userObject.token).toBeDefined();
                expect(userObject.id).toBeDefined();
                expect(userObject.username).toEqual(users[userType].username);
                expect(userObject.role).toEqual(users[userType].role);
            });





            it('get all users', async () => {
                let res = await mockRequest.get('/getallusers').set({ Authorization: `Bearer ${token[userType]}` });
                expect(res.status).toEqual(200);
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



    Object.keys(users).forEach(userType => {
        describe(`${userType} users`, () => {
            it('can add a new car', async () => {

                const response = await mockRequest.post(`/addcar`).send({
                    name: "BMW",
                    carType: "X5",
                    model: "2020",
                    photo: "https://media.ed.edmunds-media.com/bmw/x5/2020/oem/2020_bmw_x5_4dr-suv_m50i_fq_oem_1_1600.jpg",
                    rentCost: "50/day",
                    carStatus: "good",
                    status: "avaliable",
                    ownerId: 1
                }).set('Authorization', `Bearer ${token[userType]}`);
                if (userType === 'owner') {
                    expect(response.status).not.toBe(201);
                } else {
                    expect(response.status).toBe(500);
                }

            });


         

        });


    });




    it('can get all cars', async () => {
        const signRes = await mockRequest.post('/signin').auth('owner', 'password');
        const tokens = signRes.body.token;
        console.log(tokens, "tokens")
        const response = await mockRequest.get(`/getallcar`).set('Authorization', `Bearer ${tokens}`);
        expect(response.status).toBe(200);
    });


    it('can get single car', async () => {
        const signRes = await mockRequest.post('/signin').auth('owner', 'password');
        const tokens = signRes.body.token;
        console.log(tokens, "tokens")
        const response = await mockRequest.get(`/getmycar`).set('Authorization', `Bearer ${tokens}`);
        expect(response.status).toBe(201);
    });

    it('can delete a car  -- owner only', async () => {
        const signRes = await mockRequest.post('/signin').auth('owner', 'password');
        const tokens = signRes.body.token;
        const response = await mockRequest.delete(`/deletecar/1`).set('Authorization', `Bearer ${tokens}`);
        expect(response.status).toBe(201);
    });


  



    
});