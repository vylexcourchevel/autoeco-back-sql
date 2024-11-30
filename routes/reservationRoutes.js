import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
} from '../controllers/reservationController.js';

const router = express.Router();

// Middleware pour logger les requêtes entrantes
router.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.originalUrl}`);
  if (req.body) {
    console.log('Corps de la requête :', req.body);
  }
  next();  // Passe au prochain middleware ou au contrôleur
});

// Routes avec logs spécifiques si nécessaire
router.get('/all', (req, res, next) => {
  console.log('Route GET /all appelée');
  next();
}, getAllReservations);

router.post('/add', verifyToken, (req, res, next) => {
  console.log('Route POST /add appelée avec utilisateur authentifié');
  next();
}, createReservation);

// Les autres routes peuvent également inclure des logs similaires
router.get('/get/:id', getReservationById);
router.put('/update/:id', updateReservation);
router.delete('/delete/:id', deleteReservation);

export default router;

// import  express from 'express';
// import { verifyToken } from '../middleware/auth.js';

// import {
//     getAllReservations,
//     getReservationById,
//     createReservation,
//     updateReservation,
//     deleteReservation

// } from '../controllers/reservationController.js';


// const router = express.Router();




// router.get('/all', getAllReservations);
// router.get('/get/:id',getReservationById);
// router.post('/add', verifyToken, createReservation);
// router.put('/update/:id', updateReservation);
// router.delete('/delete/:id', deleteReservation);

// export default router;
