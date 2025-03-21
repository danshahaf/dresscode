require('dotenv').config();

// server.js
const fastify = require('fastify')({ logger: true });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Set your Stripe secret key in your environment

// Endpoint to create a setup intent, ephemeral key, and customer
fastify.post('/create-setup-intent', async (request, reply) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-08-01' }
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });
    return reply.send({
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: error.message });
  }
});

// Endpoint to create a PaymentIntent
fastify.post('/', async (request, reply) => {
  try {
    const { amount, currency, gateway } = request.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: [gateway],
    });
    return reply.send(paymentIntent);
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: error.message });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server is running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
