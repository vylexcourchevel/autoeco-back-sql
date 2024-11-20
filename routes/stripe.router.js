import express from "express";
import checkout from "../services/checkout.js"; // Utilisez "checkout" pour correspondre à l'export par défaut
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/create-checkout-session", verifyToken, checkout.createCheckoutSession);

export default router;

