# Stripe Payment Workflow with Node.js/Express

This project demonstrates how to create a seamless Stripe payment workflow using Node.js and Express. It covers creating a Stripe Checkout session, handling webhook events for successful payments, and calling additional functions or routes based on the payment status.

## Project Overview

### Main Features
- Create a checkout session and redirect users to Stripe's hosted payment page.
- Listen for webhook events from Stripe to handle post-payment actions.
- Verify webhook signatures for security.
- Call additional server-side logic after a successful payment. (Optional)

### Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **Stripe Account**: Sign up for a Stripe account if you don't have one.
- **Stripe CLI** (optional): Useful for local webhook testing.

## Setup Guide

1. ### Clone Repository:
Clone this repository to your local machine:
```bash
git clone https://github.com/FabrizioMarras/Stripe_payment.git
cd Stripe_payment
```
2. ### Install Dependencies
Run the following command to install the required dependencies:
```bash
npm install
```
3. ### Environment Variables
Create a .env file in the project root and add your Stripe secret key and webhook secret:
```bash
STRIPE_SECRET_KEY=sk_test_YourSecretKeyHere
WEBHOOK_SECRET=whsec_YourWebhookSecretHere
```
4. ### Start the Server
Run the server using:
```bash
node server.js
```
The server will run at `http://localhost:3000`.

## Project Structure

1. ### Client Pages
    - **index.html**: Main webpage containing a submit button to start the payment process. Implement a similar button on your webflow.
    - **success.html**: Success page where the user is redirected after a successful payment.
    - **cancel.html**: Cancel page where the user is redirected if he decide tocancel the payment.
    - **error.html**: optionally a process to handle payment errors can be implemented and the UI redirects to the error page. (Not implemented).

2. ### Client Script
    - **index.js**: Script file to handle the Payment button click and call the checkout route on the server and handle the redirect response.

3. ### Server
    - **.env**: environment varialble to store secrets keys. add variables such as `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET_KEY`. (file not included in the repo)
    - **server.js**: Main server file that handles routes and webhooks. Also added here CORS dependency tohandle CORS.

## Detailed Workflow

1. ### Creating a Checkout Session
In the `/create-checkout-session` route, the server receives a `productId` from the client and creates a Stripe Checkout `session`. The session URL is sent back to the client for redirection.

2. ### Handling Webhooks for Payment Status
The `/webhook` route listens for webhook events sent by Stripe, such as `checkout.session.completed`. The webhook verifies the signature using `stripe-signature` and processes the event.

## Running Webhooks Locally

For local webhook testing, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/webhook
```
This command forwards webhook events to your local server and provides a webhook secret to verify the signatures.

## Security Considerations

- **Verify Webhook Signatures**: Always use stripe-signature to ensure the request is genuinely from Stripe.
- **Environment Variables**: Keep your secret keys and webhook secrets secure and never commit them to version control.

## Customization

1. ### Processing Post-Payment Logic

- The `processSuccessfulPayment` function handles additional server-side actions, such as storing payment details or updating an order status. (Not implemented in this repo).
- Modify the `processSuccessfulPayment` function to include any specific post-payment processing needed for your application, such as updating user accounts, sending confirmation emails, or updating a database.

2. ### Error Page UI redirect

- Implement logic to redirect user to an error page if payment is not successful.
- Implement logic to send an email to the user if payment is not successful.

3. ### Successful Payment Optional functionality

- Implement notification system to notify you and the user when a payment is successful

## Resources

- <a href="https://docs.stripe.com/api">Stripe API Reference</a>
- <a href="https://stripe.com/docs/payments/checkout">Stripe Checkout</a>
- <a href="https://stripe.com/docs/webhooks">Stripe Webhooks</a>
- <a href="https://stripe.com/docs/stripe-cli">Stripe CLI</a>

## 

Please mention **<a href='https://fabriziomarras.com/'>FM Consulting</a>** when using this code to your web application. Thank you!