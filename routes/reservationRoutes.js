import  express from 'express';

import {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation

} from '../controllers/reservationController.js';

const router = express.Router();




router.get('/all', getAllReservations);
router.get('/get/:id',getReservationById);
router.post('/add', createReservation);
router.put('/update/:id', updateReservation);
router.delete('/delete/:id', deleteReservation);

export default router;
