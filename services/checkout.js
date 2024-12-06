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

<<<<<<< HEAD
        console.log("Session créée avec succès : ", session.url); // Log de la session créée
        // Retournez l'ID de la session au frontend
        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe : ", error.message); // Log de l'erreur
        return res.status(400).json({ error: error.message });
=======
        console.log('Session Stripe créée avec succès:', session);

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Erreur lors de la création de la session Stripe:', error.message, error.stack);
        return res.status(500).json({ error: 'Erreur interne lors de la création de la session de paiement' });
>>>>>>> deploiement
    }
};

export default { createCheckoutSession };



<<<<<<< HEAD
=======
// //services/checkout.js
>>>>>>> deploiement

// import Stripe from "stripe";
// import { env } from "../config.js";
// import { User } from '../models/index.js';
// const stripe = new Stripe(env.SECRET_KEYSTRIPE); // Initialisez Stripe correctement
<<<<<<< HEAD
=======
// console.log(stripe);
>>>>>>> deploiement

// const createCheckoutSession = async (req, res) => {
//     const domainURL = env.WEB_APP_URL; // URL de votre application front-end
//     const { totalPrice, carId } = req.body;
//     console.log(req.user);
//     const fullUser = await User.findByPk(req.user.id);
//     const email = fullUser.email;
<<<<<<< HEAD
=======
// console.log('creation de la session de stripe: ', createCheckoutSession)
>>>>>>> deploiement

//     // Vérifiez les paramètres requis
//     if (!totalPrice || !carId || !email) {
//         return res.status(400).json({ message: "Missing required parameters" });
//     }

//     try {
//         // Créez une session Stripe
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"], // Types de paiement acceptés
//             mode: "payment", // Mode de paiement unique
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "eur", // Devise
//                         product_data: {
//                             name: `Réservation pour voiture ID: ${carId}`,
//                             description: "Paiement de la réservation de voiture",
//                         },
//                         unit_amount: Math.round(totalPrice * 100), // Convertir le prix en centimes
//                     },
//                     quantity: 1, // Toujours 1 pour une réservation
//                 },
//             ],
//             customer_email: email, // Email du client
//             success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirection en cas de succès
//             cancel_url: `${domainURL}/cancel`, // Redirection en cas d'annulation
//             shipping_address_collection: { allowed_countries: ["FR"] }, // Limitez les adresses à la France
//         });
<<<<<<< HEAD
=======
//         console.log('session: ', session);
>>>>>>> deploiement

//         // Retournez l'ID de la session au frontend
//         return res.status(200).json({ url: session.url });
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// };

// export default { createCheckoutSession };
