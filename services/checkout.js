import Stripe from "stripe";
import { env } from "../config.js";
import { User } from '../models/index.js';
const stripe = new Stripe(env.SECRET_KEYSTRIPE); // Initialisez Stripe correctement

const createCheckoutSession = async (req, res) => {
    const domainURL = env.WEB_APP_URL; // URL de votre application front-end
    const { totalPrice, carId } = req.body;

    // Log de l'utilisateur et des données reçues
    console.log("Utilisateur connecté : ", req.user); // Log l'utilisateur qui fait la requête
    console.log("Données reçues pour la session : ", { totalPrice, carId }); // Log des données reçues du frontend

    // Assurez-vous que l'utilisateur existe
    const fullUser = await User.findByPk(req.user.id);
    if (!fullUser) {
        console.log("Utilisateur non trouvé !");
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    const email = fullUser.email;
    console.log("Email de l'utilisateur : ", email); // Log de l'email

    // Vérifiez les paramètres requis
    if (!totalPrice || !carId || !email) {
        console.log("Paramètres manquants !"); // Log des paramètres manquants
        return res.status(400).json({ message: "Missing required parameters" });
    }

    try {
        // Créez une session Stripe
        console.log("Création de la session Stripe..."); // Log avant la création de la session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"], // Types de paiement acceptés
            mode: "payment", // Mode de paiement unique
            line_items: [
                {
                    price_data: {
                        currency: "eur", // Devise
                        product_data: {
                            name: `Réservation pour voiture ID: ${carId}`,
                            description: "Paiement de la réservation de voiture",
                        },
                        unit_amount: Math.round(totalPrice * 100), // Convertir le prix en centimes
                    },
                    quantity: 1, // Toujours 1 pour une réservation
                },
            ],
            customer_email: email, // Email du client
            success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirection en cas de succès
            cancel_url: `${domainURL}/cancel`, // Redirection en cas d'annulation
            shipping_address_collection: { allowed_countries: ["FR"] }, // Limitez les adresses à la France
        });

        console.log("Session créée avec succès : ", session.url); // Log de la session créée
        // Retournez l'ID de la session au frontend
        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe : ", error.message); // Log de l'erreur
        return res.status(400).json({ error: error.message });
    }
};

export default { createCheckoutSession };




// import Stripe from "stripe";
// import { env } from "../config.js";
// import { User } from '../models/index.js';
// const stripe = new Stripe(env.SECRET_KEYSTRIPE); // Initialisez Stripe correctement

// const createCheckoutSession = async (req, res) => {
//     const domainURL = env.WEB_APP_URL; // URL de votre application front-end
//     const { totalPrice, carId } = req.body;
//     console.log(req.user);
//     const fullUser = await User.findByPk(req.user.id);
//     const email = fullUser.email;

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

//         // Retournez l'ID de la session au frontend
//         return res.status(200).json({ url: session.url });
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// };

// export default { createCheckoutSession };
