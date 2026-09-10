# His Image Performing Arts — Merch Checkout

A simple page for the QR code: mom scans it, picks T-Shirt ($22) and/or
Sweatshirt ($40) in any quantities, pays right there on her phone, and
sees "Payment has been received. Thank you for purchasing!"

## What's in here

- `checkout.html` — the page moms see
- `netlify/functions/create-checkout-session.js` — creates the Stripe
  payment session for the whole cart (needs your secret key, kept
  safely on the server)
- `netlify/functions/check-session.js` — confirms payment actually
  went through before showing the "Payment received" message
- `netlify.toml` / `package.json` — Netlify configuration

## Setup (about 10 minutes)

### 1. Get your three Stripe values
In your Stripe Dashboard:
- **Secret key**: Developers → API keys → Secret key (starts with `sk_live_...` or `sk_test_...`)
- **Publishable key**: same page, starts with `pk_live_...` or `pk_test_...`
- **Price IDs** for the T-Shirt and Sweatshirt: Product catalog → click each product → copy the Price ID (starts with `price_...`)

### 2. Fill in the placeholders in `checkout.html`
Open `checkout.html` and replace these three spots (there are two copies
of the price IDs in the file — the `data-price-id` attributes near the
top, and the `prices` object in the `<script>` near the bottom):

- `{{PUBLISHABLE_KEY}}` → your `pk_live_...` key
- `{{PRICE_ID_TSHIRT}}` → your T-shirt's `price_...` ID
- `{{PRICE_ID_SWEATSHIRT}}` → your sweatshirt's `price_...` ID

### 3. Deploy to Netlify
- Create a new Netlify site (or use your existing one) and deploy this folder
- In **Site settings → Environment variables**, add:
  - `STRIPE_SECRET_KEY` = your `sk_live_...` key
- Deploy

**Important:** Netlify's plain drag-and-drop deploy only publishes
static files (like `checkout.html`) — it will not pick up the
`netlify/functions` folder or install the `stripe` package. For the
two server functions to actually run, deploy via a Git repo connection
(push this folder to GitHub and link it in Netlify) or the Netlify
CLI, rather than dragging the zip onto the dashboard.

### 4. Generate the QR code
Once deployed, your checkout page will be at:
`https://yoursite.netlify.app/checkout.html`

Make a QR code pointing to that exact URL (any free QR generator works —
e.g. qr-code-generator.com) and print it for the merch table.

## A couple of notes

- **Multiple items, any quantity.** Mom can tap `+`/`−` on either item
  and buy both a t-shirt and a sweatshirt (in any quantities) in one
  payment.
- **Test mode first.** Before going live, it's worth using your
  `sk_test_...` / `pk_test_...` keys and Stripe's test card
  (4242 4242 4242 4242, any future date/CVC) to walk through a full
  purchase once, so you can see the confirmation message actually
  fire.
- **Security:** the secret key only ever lives in Netlify's environment
  variables — never in a file, never visible to anyone visiting the page.
