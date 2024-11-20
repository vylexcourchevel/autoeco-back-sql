import Stripe from "stripe";
import { env } from "../config.js";

const stripe = new Stripe(env.SECRET_KEYSTRIPE); // Initialisez Stripe correctement

const createCheckoutSession = async (req, res) => {
    const domainURL = env.WEB_APP_URL; // URL de votre application front-end
    const { totalPrice, carId, email } = req.body;

    // Vérifiez les paramètres requis
    if (!totalPrice || !carId || !email) {
        return res.status(400).json({ message: "Missing required parameters" });
    }

    try {
        // Créez une session Stripe
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

        // Retournez l'ID de la session au frontend
        return res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe :", error);
        return res.status(400).json({ error: error.message });
    }
};

export default { createCheckoutSession };



// import Stripe from "stripe";
// import { env } from "../config.js";


// const stripe = new Stripe(env.SECRET_KEYSTRIPE); // Initialisez Stripe correctement

// const createCheckoutSession = async (req, res) => {
//     const domainURL = env.WEB_APP_URL;
//     const { line_items, customer_email } = req.body;

//     if (!line_items || !customer_email) {
//         return res.status(400).json({ message: "Missing required parameters" });
//     }

//     try {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             mode: "payment",
//             line_items,
//             customer_email,
//             success_url: `${domainURL}/success?SESSION_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${domainURL}/cancel`,
//             shipping_address_collection: { allowed_countries: ["FR"] },
//         });

//         return res.status(200).json({ sessionId: session.id });
//     } catch (error) {
//         console.error(error);
//         return res.status(400).json({ error: error.message });
//     }
// };

// export default { createCheckoutSession };

