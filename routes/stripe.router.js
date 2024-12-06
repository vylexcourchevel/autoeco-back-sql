
import express from "express";  // Importation du framework Express pour créer des routes.
import checkout from "../services/checkout.js";  // Importation du service de gestion des paiements Stripe.
import { verifyToken } from "../middleware/auth.js";  // Importation du middleware pour vérifier l'authentification de l'utilisateur.

const router = express.Router();  // Création d'un routeur Express.


// Route POST pour créer une session de paiement Stripe.
// L'endpoint est protégé par le middleware `verifyToken`.
// Cela signifie que seuls les utilisateurs authentifiés peuvent accéder à cette route.
router.post("/create-checkout-session", verifyToken, checkout.createCheckoutSession);


// Exportation du routeur pour qu'il puisse être utilisé dans le reste de l'application.
export default router;

// import express from "express";
// import checkout from "../services/checkout.js"; // Utilisez "checkout" pour correspondre à l'export par défaut
// import { verifyToken } from "../middleware/auth.js";
// const router = express.Router();

// router.post("/create-checkout-session", verifyToken, checkout.createCheckoutSession);

// export default router;

