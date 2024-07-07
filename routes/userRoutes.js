import  express from 'express';



import {
   add,
   getAll,
   getUserById,
   updateUser,
   deleteUser

} from '../controllers/userController.js';


const router = express.Router();

router.post('/add', add);
router.get('/all', getAll );
router.get('/get/:id', getUserById);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router