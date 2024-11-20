import express from "express";
import checkout from "../services/checkout.js"; // Utilisez "checkout" pour correspondre à l'export par défaut

const router = express.Router();

router.post("/create-checkout-session", checkout.createCheckoutSession);

export default router;

