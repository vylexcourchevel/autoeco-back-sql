import  express from 'express';


import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment

} from '../controllers/paymentController.js';



const router = express.Router();

router.get('/all', getAllPayments);
router.get('/get/:id', getPaymentById);
router.post('/add', createPayment);
router.put('/update/:id', updatePayment);
router.delete('/delete/:id', deletePayment);

export default router;
