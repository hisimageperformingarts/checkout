// This runs on the SERVER too. It double-checks with Stripe that a
// session actually paid before the page shows "Payment received" —
// so someone can't just type a fake session_id into the URL and see
// a confirmation without paying.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  try {
    const sessionId = event.queryStringParameters.session_id;

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing session_id' }),
      };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: session.payment_status, // 'paid', 'unpaid', etc.
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
