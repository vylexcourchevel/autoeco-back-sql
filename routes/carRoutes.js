import  express  from 'express';



import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from '../controllers/carController.js';

const router = express.Router();



router.get('/all', getAllCars);
router.get('/get/:id', getCarById);
router.post('/add', createCar);
router.put('/update/:id', updateCar);
router.delete('/delete/:id', deleteCar);


export default router;
