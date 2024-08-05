// userRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';


import {
   add,
   getAll,
   getUserById,
   updateUser,
   deleteUser,
   login,
   register
} from '../controllers/userController.js';

const router = express.Router();

router.post('/add', verifyToken, add);
router.get('/all', getAll);
router.get('/get/:id',  getUserById);
router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

// Routes pour l'inscription et la connexion
router.post('/register', register);
router.post('/login',  login);



export default router;

