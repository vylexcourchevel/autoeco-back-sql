// tests/auth.test.js

// a mettre obligatoirement avant de commencer le test !!!!
process.env.NODE_ENV = 'test';
import 'jest-extended';

import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from '../routes/userRoutes.js';
import sequelize from '../config/database.js';
import User from '../models/user.js';




dotenv.config();

// faire un fichier test par controller !! !


// Configure l'application Express
