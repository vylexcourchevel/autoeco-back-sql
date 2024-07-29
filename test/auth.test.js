// tests/auth.test.js
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from '../routes/userRoutes.js';
import sequelize from '../config/database.js';
import User from '../models/user.js';


dotenv.config();

// Configure l'application Express
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', userRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  console.log("Database synced");
});

afterAll(async () => {
  await sequelize.close();
  console.log("Database connection closed");
});

describe('Authentication Tests', () => {
  let token;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        address: '123 Main St',
        phoneNumber: '1234567890'
      });

    console.log("Response from signup:", res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual('User has been created!');
  });

  it('should login the user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123'
      });

    console.log("Response from login:", res.body);
    console.log("Cookies from login response:", res.headers['set-cookie']);
    expect(res.statusCode).toEqual(200);
    expect(res.headers['set-cookie'][0]).toMatch(/access_token/);
    token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];
    console.log("Extracted token:", token);
  });

  it('should not access protected route without token', async () => {
    const res = await request(app)
      .get('/api/auth/all');

    console.log("Response from protected route without token:", res.body);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual('Access denied');
  });

  it('should access protected route with token', async () => {
    const res = await request(app)
      .get('/api/auth/all')
      .set('Cookie', [`access_token=${token}`]);

    console.log("Response from protected route with token:", res.body);
    expect(res.statusCode).toEqual(200);
  });
});
