# Stripe Integration Setup Guide# Stripe Integration Setup Guide



## 📋 Prerequisites## 📋 Prerequisites

- Stripe Account (create at https://stripe.com)- Stripe Account (create at https://stripe.com)

- Node.js and npm installed- Node.js and npm installed



## 🔧 Setup Steps## 🔧 Setup Steps



### 1. Get Stripe API Keys### 1. Get Stripe API Keys



1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

2. Copy your **Publishable key** and **Secret key**2. Copy your **Publishable key** and **Secret key**

3. Use **Test mode** keys for development3. Use **Test mode** keys for development



### 2. Create Products & Prices in Stripe### 2. Create Products & Prices in Stripe

1. Go to [Stripe Products](https://dashboard.stripe.com/test/products)1. Go to [Stripe Products](https://dashboard.stripe.com/test/products)

2. Click "Add Product"2. Click "Add Product"

3. Create two products:3. Create two products:



#### Starter Plan#### Starter Plan

- **Name**: Starter Plan- **Name**: Starter Plan

- **Description**: Perfect for small teams and startups- **Description**: Perfect for small teams and startups

- **Pricing**: $29/month (recurring)- **Pricing**: $29/month (recurring)

- After creating, copy the **Price ID** (starts with `price_`)- After creating, copy the **Price ID** (starts with `price_`)



#### Professional Plan#### Professional Plan

- **Name**: Professional Plan  - **Name**: Professional Plan  

- **Description**: Best for growing businesses- **Description**: Best for growing businesses

- **Pricing**: $99/month (recurring)- **Pricing**: $99/month (recurring)

- After creating, copy the **Price ID** (starts with `price_`)- After creating, copy the **Price ID** (starts with `price_`)



### 3. Update Environment Variables### 3. Update Environment Variables



Edit `.env.local` file:Edit `.env.local` file:



```env```env

# Replace with your actual Stripe keys# Replace with your actual Stripe keys

STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERESTRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERENEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE



# Update for production deployment# Update for production deployment

NEXT_PUBLIC_BASE_URL=http://localhost:3000NEXT_PUBLIC_BASE_URL=http://localhost:3000

``````



### 4. Update Price IDs in Code### 4. Update Price IDs in Code



Edit `components/Pricing.jsx` and replace the Price IDs:Edit `components/Pricing.jsx` and replace the Price IDs:



```javascript```javascript

const pricingPlans = [const pricingPlans = [

  {  {

    // ...    // ...

    priceId: "price_xxxxxxxxxxxxx", // Your Starter Plan Price ID    priceId: "price_xxxxxxxxxxxxx", // Your Starter Plan Price ID

  },  },

  {  {

    // ...    // ...

    priceId: "price_xxxxxxxxxxxxx", // Your Professional Plan Price ID    priceId: "price_xxxxxxxxxxxxx", // Your Professional Plan Price ID

  },  },

];];

``````



### 5. Test the Integration### 5. Test the Integration



1. Start the development server:1. Start the development server:

   ```bash   ```bash

   npm run dev   npm run dev

   ```   ```



2. Navigate to the pricing section2. Navigate to the pricing section

3. Click "Get Started" on any plan3. Click "Get Started" on any plan

4. You should be redirected to Stripe Checkout4. You should be redirected to Stripe Checkout

5. Use Stripe test card: `4242 4242 4242 4242`5. Use Stripe test card: `4242 4242 4242 4242`

   - Use any future date for expiry   - Use any future date for expiry

   - Use any 3 digits for CVC   - Use any 3 digits for CVC

   - Use any valid ZIP code   - Use any valid ZIP code



### 6. Webhook Setup (Optional but Recommended)### 6. Webhook Setup (Optional but Recommended)



1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)

2. Click "Add endpoint"2. Click "Add endpoint"

3. URL: `https://yourdomain.com/api/webhook`3. URL: `https://yourdomain.com/api/webhook`

4. Select events:4. Select events:

   - `checkout.session.completed`   - `checkout.session.completed`

   - `customer.subscription.created`   - `customer.subscription.created`

   - `customer.subscription.updated`   - `customer.subscription.updated`

   - `customer.subscription.deleted`   - `customer.subscription.deleted`



## 🚀 Production Deployment## 🚀 Production Deployment



1. Switch to live mode keys in Stripe Dashboard1. Switch to live mode keys in Stripe Dashboard

2. Update `.env.local` with live keys2. Update `.env.local` with live keys

3. Update `NEXT_PUBLIC_BASE_URL` to your production URL3. Update `NEXT_PUBLIC_BASE_URL` to your production URL

4. Deploy to your hosting platform4. Deploy to your hosting platform

5. Test with real payment methods5. Test with real payment methods



## 📝 Important Notes## 📝 Important Notes



- Never commit `.env.local` to version control- Never commit `.env.local` to version control

- Always use test mode during development- Always use test mode during development

- Keep your secret keys secure- Keep your secret keys secure

- Test all payment flows before going live- Test all payment flows before going live



## 📧 Email Notifications Setup## � Email Notifications Setup



When a customer completes payment, they will receive an email automatically. Here's how it works:When a customer completes payment, they will receive an email automatically. Here's how it works:



### Automatic Stripe Receipts (Built-in)### Automatic Stripe Receipts (Built-in)

Stripe automatically sends receipt emails to customers after successful payments. This is enabled by default.Stripe automatically sends receipt emails to customers after successful payments. This is enabled by default.



### Custom Confirmation Emails (Advanced)### Custom Confirmation Emails (Advanced)

For custom branded emails, you need to:For custom branded emails, you need to:



1. **Setup Webhook in Stripe Dashboard:**1. **Setup Webhook in Stripe Dashboard:**

   - Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)   - Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)

   - Click "Add endpoint"   - Click "Add endpoint"

   - URL: `https://yourdomain.com/api/webhook`   - URL: `https://yourdomain.com/api/webhook`

   - Events to listen: `checkout.session.completed`   - Events to listen: `checkout.session.completed`

   - Copy the webhook signing secret   - Copy the webhook signing secret

   - Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`   - Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`



2. **Test Webhook Locally (Development):**2. **Test Webhook Locally (Development):**

   ```bash   ```bash

   # Install Stripe CLI   # Install Stripe CLI

   stripe login   stripe login

      

   # Forward webhooks to local server   # Forward webhooks to local server

   stripe listen --forward-to localhost:3000/api/webhook   stripe listen --forward-to localhost:3000/api/webhook

      

   # This will give you a webhook secret starting with whsec_   # This will give you a webhook secret starting with whsec_

   # Copy this to your .env.local   # Copy this to your .env.local

   ```   ```



3. **Integrate Email Service (Optional):**3. **Integrate Email Service (Optional):**

      

   The webhook is ready but needs an email service. Choose one:   The webhook is ready but needs an email service. Choose one:

      

   **Option A: SendGrid**   **Option A: SendGrid**

   ```bash   ```bash

   npm install @sendgrid/mail   npm install @sendgrid/mail

   ```   ```

   Update webhook route with SendGrid API key.   Update webhook route with SendGrid API key.

      

   **Option B: Resend (Recommended)**   **Option B: Resend (Recommended)**

   ```bash   ```bash

   npm install resend   npm install resend

   ```   ```

   Add to `.env.local`: `RESEND_API_KEY=your_key`   Add to `.env.local`: `RESEND_API_KEY=your_key`

      

   **Option C: Nodemailer (SMTP)**   **Option C: Nodemailer (SMTP)**

   ```bash   ```bash

   npm install nodemailer   npm install nodemailer

   ```   ```

   Configure SMTP settings in webhook.   Configure SMTP settings in webhook.



### What Customers See:### What Customers See:

1. **Email Modal** - Before payment, customer enters email1. **Email Modal** - Before payment, customer enters email

2. **Stripe Checkout** - Email is pre-filled in Stripe form2. **Stripe Checkout** - Email is pre-filled in Stripe form

3. **Stripe Receipt** - Automatic receipt after payment (always works)3. **Stripe Receipt** - Automatic receipt after payment (always works)

4. **Custom Email** - Your branded confirmation (needs webhook setup)4. **Custom Email** - Your branded confirmation (needs webhook setup)



## 🔒 Security## �🔒 Security



- Secret keys are only used on the server-side (API routes)- Secret keys are only used on the server-side (API routes)

- Publishable keys are safe to use in client-side code- Publishable keys are safe to use in client-side code

- All payment processing happens on Stripe's secure servers- All payment processing happens on Stripe's secure servers

- No credit card data is ever stored in your application- No credit card data is ever stored in your application

- Webhook signatures are verified for security- Webhook signatures are verified for security



## 🆘 Troubleshooting## 🆘 Troubleshooting



### "Module not found: Can't resolve 'stripe'"### "Module not found: Can't resolve 'stripe'"

- Run: `npm install stripe`- Run: `npm install stripe`

- Restart the development server- Restart the development server



### "Invalid API Key"### "Invalid API Key"

- Check that your keys are correctly copied- Check that your keys are correctly copied

- Ensure no extra spaces in `.env.local`- Ensure no extra spaces in `.env.local`

- Verify you're using the correct mode (test/live)- Verify you're using the correct mode (test/live)



### Checkout Session Not Creating### Checkout Session Not Creating

- Check server console for errors- Check server console for errors

- Verify Price IDs are correct- Verify Price IDs are correct

- Ensure `.env.local` is loaded- Ensure `.env.local` is loaded



## 📚 Resources## 📚 Resources



- [Stripe Documentation](https://stripe.com/docs)- [Stripe Documentation](https://stripe.com/docs)

- [Stripe Checkout](https://stripe.com/docs/payments/checkout)- [Stripe Checkout](https://stripe.com/docs/payments/checkout)

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

