document.addEventListener('DOMContentLoaded', function () {
   
    const button = document.getElementById('payment');
    const productId = 'your-product-id'; // Paste here your Stripe product ID

    button && button.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            // Fetch the client secret from your server
            const response = await fetch('http://localhost:3000/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }) 
            });
            // Url to redirect to Stripe Payment Page:    
            const { url } = await response.json();
            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error('Error during payment:', error);
        }
    });
});
