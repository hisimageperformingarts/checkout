// This runs on the SERVER (Netlify), never in the browser.
// It uses your Stripe SECRET key, which is set as an environment
// variable in Netlify — never pasted into this file.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body);

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or empty items array' }),
      };
    }

    // Figure out the site's own URL so Stripe knows where to send
    // the customer back to after they pay.
    const origin = event.headers.origin || `https://${event.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: items.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      // After paying, Stripe sends them back to checkout.html with
      // the session id attached so we can confirm payment succeeded.
      return_url: `${origin}/checkout.html?session_id={CHECKOUT_SESSION_ID}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: session.client_secret }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
