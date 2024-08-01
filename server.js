import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
//import upload from './middleware/multer-config.js';

// Importation des modules nécessaires
import './models/index.js';
import paymentRoutes from './routes/paymentRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import userRoutes from './routes/userRoutes.js';
//import carImageRoutes from './routes/carImageRoutes.js';

const app = express();

// Middleware pour gérer les problèmes de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});

// Définition du port
dotenv.config();
const PORT = process.env.PORT || 5000;


// Middleware pour traiter les requêtes JSON
app.use(express.json());
app.use(cookieParser()); // Middleware pour traiter les cookies


// Définition des routes pour l'application
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


