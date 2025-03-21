// index.ts
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import Stripe from 'npm:stripe';

// Initialize Stripe with your secret key from environment variables
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in the environment variables");
}
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-08-01" });

serve(async (req) => {
  const { pathname } = new URL(req.url);
  
  if (pathname === '/create-setup-intent' && req.method === 'POST') {
    try {
      // Create a new customer
      const customer = await stripe.customers.create();
      // Create an ephemeral key for the customer
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2022-08-01' }
      );
      // Create a setup intent for the customer
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
      });
      return new Response(JSON.stringify({
        setupIntent: setupIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (pathname === '/' && req.method === 'POST') {
    try {
      const body = await req.json();
      const { amount, currency, gateway } = body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(amount),
        currency: currency,
        payment_method_types: [gateway],
      });
      return new Response(JSON.stringify(paymentIntent), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response("Not Found", { status: 404 });
  }
});
