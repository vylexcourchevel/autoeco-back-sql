import express from 'express';
import multer from '../middleware/multer-config.js';

import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from '../controllers/carController.js';

const router = express.Router();

router.get('/all', getAllCars);
router.get('/:id', getCarById);
router.post('/add', multer.single('image'),  createCar);
//on test post au lieu de put
router.post('/update/:id',  updateCar);
router.delete('/delete/:id', deleteCar);


export default router;
