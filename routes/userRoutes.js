// userRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';

//RAJOUT TEST resetPassword
import { requestPasswordReset, resetPassword } from '../controllers/userController.js';







import {
   add,
   getAll,
   getUserById,
   updateUser,
   deleteUser,
   login,
   logout,
   register,
   getCurrentUser,
   updateAdminStatus
} from '../controllers/userController.js';

const router = express.Router();

router.post('/add', verifyToken, add);
router.get('/all',verifyToken, getAll);
router.get('/get/:id',  getUserById);
router.get('/getCurrent', verifyToken, getCurrentUser);
router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

//route pour modifier l'id du user pour voir s'il est admin ou pas

router.post('/admin/:id', verifyToken, updateAdminStatus);

// Routes pour l'inscription et la connexion
router.post('/register', register);
router.post('/login',  login);

//Routes pour la suppression des cookies

router.post('/logout', logout);

//routes pour resetPassword  TEST VIGHEN 
router.post('/forgot-password', requestPasswordReset);  // Envoi du lien de réinitialisation
router.post('/reset-password/:token', resetPassword);  // Réinitialisation du mot de passe

// Route pour vérifier la validité du token
//router.post('/verify-reset-token', verifyToken);



export default router;



 // userRoutes.js
// import express from 'express';
// import { verifyToken } from '../middleware/auth.js';



// import {
//    add,
//    getAll,
//    getUserById,
//    updateUser,
//    deleteUser,
//    login,
//    logout,
//    register,
//    getCurrentUser,
//    updateAdminStatus
// } from '../controllers/userController.js';

// const router = express.Router();

// router.post('/add', verifyToken, add);
// router.get('/all',verifyToken, getAll);
// router.get('/get/:id',  getUserById);
// router.get('/getCurrent', verifyToken, getCurrentUser);
// router.put('/update/:id', verifyToken, updateUser);
// router.delete('/delete/:id', verifyToken, deleteUser);

// //route pour modifier l'id du user pour voir s'il est admin ou pas

// router.post('/admin/:id', verifyToken, updateAdminStatus);

// // Routes pour l'inscription et la connexion
// router.post('/register', register);
// router.post('/login',  login);

// //Routes pour la suppression des cookies

// router.post('/logout', logout);



// export default router;

