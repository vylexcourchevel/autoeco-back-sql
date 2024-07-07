import express from 'express';


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

const app = express();

//PORT
const PORT = process.env.PORT || 8000;


// MIDDLEWARE
app.use(express.json()); // Middleware pour traiter les requêtes JSON
//app.use(cookieParser()); // Middleware pour traiter les cookies
// app.use(cors()); // Middleware pour gérer les requêtes cross-origin


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
