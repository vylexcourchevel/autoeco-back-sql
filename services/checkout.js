import Stripe from "stripe";
import { env } from "../config.js";


const stripe = new Stripe(env.SECRET_KEYSTRIPE); // Initialisez Stripe correctement

const createCheckoutSession = async (req, res) => {
    const domainURL = env.WEB_APP_URL;
    const { line_items, customer_email } = req.body;

    if (!line_items || !customer_email) {
        return res.status(400).json({ message: "Missing required parameters" });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            customer_email,
            success_url: `${domainURL}/success?SESSION_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainURL}/cancel`,
            shipping_address_collection: { allowed_countries: ["FR"] },
        });

        return res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

export default { createCheckoutSession };

