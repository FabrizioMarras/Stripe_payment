const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const app = express();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { productId } = req.body; 
        let priceId;
        let productName;
        // Fetch the product details to get the name
        const product = await stripe.products.retrieve(productId);
        productName = product.name;
        // List all prices for the given product ID
        const prices = await stripe.prices.list({
            product: productId,
            active: true, // filter only active prices
        });
        console.log('Prices', prices.data)
        // Filter for one-time payment prices
        const oneTimePrices = prices.data.filter(price => price.type === 'one_time');
        if (oneTimePrices.length > 0) {
            // Sort the one-time prices by the 'created' timestamp in descending order to get the most recent one
            const mostRecentPrice = oneTimePrices.sort((a, b) => b.created - a.created)[0];
            priceId = mostRecentPrice.id;
            console.log('Selected most recent one-time price ID:', priceId);
        } else {
            res.status(404).json({ error: 'No one-time price found for the given product ID' });
            return; // Ensure that the function stops here if no price is found
        }
        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            success_url: 'http://localhost:5500/success.html?session_id={CHECKOUT_SESSION_ID}', // Replace with your domain
            cancel_url: 'http://localhost:5500/cancel.html', // Replace with your domain
        });
        console.log('Session URL:', session.url)
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        console.log('constructing webhook event...')
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout session completed:', session);
            // Extract necessary details and send them to your server for further processing
            const paymentDetails = {
                stripeUserId: session.client_reference_id,
                emailAddress: session.customer_details.email,
                paymentId: session.payment_intent,
                product: productName,
                amount: session.amount_total,
                status: 'success'
            };
            console.log('Payment User Object', paymentDetails);

            // You can add extra functionality here once successful payment happens:
            // store this data in your database or use it as needed, 
            // run other functions/routes, 
            // send notifications etc...

            break;
        case 'payment_intent.payment_failed':
            const paymentIntent = event.data.object;
            console.error('Payment failed:', paymentIntent.last_payment_error.message);
            // Handle failed payment logic (e.g., notify the user)
            break;
        // handle other event type...
        default:
            console.log(`Unhandled event type ${event.type}`);   
    }

    res.status(200).json({ received: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
