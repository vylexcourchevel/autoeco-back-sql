import express from 'express';
import cors from 'cors';





//require('dotenv').config();


// Connexion MySQL
import './models/index.js';

//ROUTES

import paymentRoutes from './routes/paymentRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import userRoutes from './routes/userRoutes.js';
// const carTypeRoutes = require('./routes/carTypeRoutes');
// const carLocationRoutes = require('./routes/carLocationRoutes');
// const carImageRoutes = require('./routes/carImageRoutes');


// démarrage du serveur a mettre en premier apes les import !!!!!!!!    
const app = express();
//si use use.cors marche pas rempalce par cette fonction

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});

//PORT
const PORT = process.env.PORT || 8000;


// MIDDLEWARE
app.use(express.json()); // Middleware pour traiter les requêtes JSON


// ROUTES

app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
// app.use('/api/car-types', carTypeRoutes);
// app.use('/api/car-locations', carLocationRoutes);
// app.use('/api/car-images', carImageRoutes);
 



// sequelize.sync().then(() => {
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
//});
