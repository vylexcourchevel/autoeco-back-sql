// import Stripe from "stripe";
// import ENV from "../config.js";


// const stripe = new Stripe(ENV.SECRET_KEYSTRIPE);

//export default stripe

const ENV = require("../config.js");
const stripe = require("stripe")(ENV.SECRET_KEYSTRIPE);

module.exports = stripe