//server.js

import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
//import upload from './middleware/multer-config.js';

// Importation des modules nécessaires
import './models/index.js';
import paymentRoutes from './routes/paymentRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import userRoutes from './routes/userRoutes.js';

//ROUTES STRIPE 

import stripeRoutes from './routes/stripe.router.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//TEST VIGHEN ADRESSE DEPLOIEMENT SITE 
app.use(cors({
  origin: process.env.FRONTEND_SERVER,
  credentials: true
}))


// Définition du port
dotenv.config();
const PORT = process.env.PORT || 8002;
app.use(express.static('public'));

// Middleware pour traiter les requêtes JSON
app.use(express.json());
app.use(cookieParser()); // Middleware pour traiter les cookies


// Définition des routes pour l'application
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);

//STRIPE 
app.use('/api/stripe', stripeRoutes);

app.get('/static/:dir/:file', (req, res) => {
  res.sendFile(__dirname + "/frontend/build/static/" + req.params.dir + "/" + req.params.file)
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile(__dirname + "/frontend/public/favicon.ico");
})
app.get('/*', (req, res) => {
  res.sendFile(__dirname + "/frontend/build/index.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


