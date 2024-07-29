// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


// Importation des modules nécessaires
import './models/index.js';
import paymentRoutes from './routes/paymentRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import userRoutes from './routes/userRoutes.js';



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
const PORT = process.env.PORT;

// Middleware pour traiter les requêtes JSON
app.use(express.json());
app.use(cookieParser()); // Middleware pour traiter les cookies

// Définition des routes pour l'application
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);


// // Route pour l'authentification
// app.use('api/user/login', userRoutes);
// app.use('api/user/register', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// // Importation des modules nécessaires
// import express from 'express';

// // Importation de la configuration dotenv (commentée car non utilisée ici)
// // require('dotenv').config();

// // Connexion à MySQL (les détails de connexion sont dans './models/index.js')
// import './models/index.js';

// // Importation des routes et des fonctionnalité dans les controllers
// import paymentRoutes from './routes/paymentRoutes.js';
// import carRoutes from './routes/carRoutes.js';
// import reservationRoutes from './routes/reservationRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// // const carTypeRoutes = require('./routes/carTypeRoutes'); // Commenté car non utilisé
// // const carLocationRoutes = require('./routes/carLocationRoutes'); // Commenté car non utilisé
// // import carImageRoutes from './routes/carImageRoutes'; // Commenté car non utilisé

// // Démarrage du serveur (doit être fait après les imports)
// const app = express();

// // Middleware pour gérer les problèmes de CORS (Cross-Origin Resource Sharing)
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   return next();
// });

// // Définition du port (soit à partir des variables d'environnement, soit 8000 par défaut)
// const PORT = process.env.PORT || 8000;

// // Middleware pour traiter les requêtes JSON
// app.use(express.json());

// // Définition des routes pour l'application
// app.use('/api/cars', carRoutes); // Routes pour les voitures
// app.use('/api/users', userRoutes); // Routes pour les utilisateurs
// app.use('/api/reservations', reservationRoutes); // Routes pour les réservations
// app.use('/api/payments', paymentRoutes); // Routes pour les paiements
// // app.use('/api/car-types', carTypeRoutes); // Commenté car non utilisé
// // app.use('/api/car-locations', carLocationRoutes); // Commenté car non utilisé
// // app.use('/api/car-images', carImageRoutes); // Commenté car non utilisé

// // Route liée à l'authentification
// app.use('/api/auth', userRoutes);

// // Synchronisation avec la base de données (commenté car non utilisé ici)
// // sequelize.sync().then(() => {
  
// // Démarrage du serveur sur le port défini
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// // });
