//services/checkout.js  test avec les console.log
import Stripe from "stripe";
import { env } from "../config.js";
import { User } from '../models/index.js';

const stripe = new Stripe(env.SECRET_KEYSTRIPE);
console.log('Stripe initialisé avec la clé:', env.SECRET_KEYSTRIPE ? 'Clé fournie' : 'Clé manquante');

const createCheckoutSession = async (req, res) => {
    const domainURL = env.WEB_APP_URL;
    const { totalPrice, carId } = req.body;

    console.log('Requête reçue avec les données:', req.body);
    console.log('Utilisateur authentifié:', req.user);

    try {
        const fullUser = await User.findByPk(req.user.id);
        console.log('Utilisateur trouvé dans la base de données:', fullUser);

        if (!fullUser) {
            console.error('Utilisateur introuvable dans la base de données');
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const email = fullUser.email;
        console.log('Email de l\'utilisateur:', email);

        if (!totalPrice || !carId || !email) {
            console.error('Paramètres manquants:', { totalPrice, carId, email });
            return res.status(400).json({ message: "Paramètres requis manquants" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Réservation pour voiture ID: ${carId}`,
                            description: "Paiement de la réservation de voiture",
                        },
                        unit_amount: Math.round(totalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainURL}/cancel`,
            shipping_address_collection: { allowed_countries: ["FR"] },
        });

        console.log('Session Stripe créée avec succès:', session);

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Erreur lors de la création de la session Stripe:', error.message, error.stack);
        return res.status(500).json({ error: 'Erreur interne lors de la création de la session de paiement' });
    }
};

export default { createCheckoutSession };

