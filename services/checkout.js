const stripeAPI = require("./stripe");

const createCheckoutSession = async (req, res) => {
   const domainURL = ENV.WEB_APP_URL;
   const { line_items , customer_email} = req.body;

   if(!line_items || !customer_email){
      return res.status(400).json({ message: "Missing required parameters" });
   }
try{
   const session = await stripeAPI.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: 'http;//exemple.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: `http;//exemple.com/cancel`,
      shipping_address_collection: {
         allowed_countries: ["FR"],
      }
   })

   return res.status(200).json({ sessionId: session.id });
  
   } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });

}
}