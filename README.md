# BAZAR - Running the Platform

BAZAR is a dual-engine hyperlocal commerce platform built with a Turborepo monorepo. Follow these steps to get the entire ecosystem running on your machine.

## 1. Prerequisites
- **Node.js**: v18 or higher
- **Supabase CLI**: For running the backend locally or deploying migrations
- **Expo Go App**: On your phone (to test the mobile runner app)
- **Razorpay Account**: In Test Mode (for payments)

## 2. Initial Setup

### Install Dependencies
From the root directory, run:
```bash
npm install
```

### Supabase Backend
1. **Migrations**: Push the schema to your Supabase project:
   ```bash
   supabase db push
   ```
2. **Edge Functions**: Deploy the order routing and payment verification functions:
   ```bash
   supabase functions deploy process-order
   supabase functions deploy verify-payment
   ```
3. **Secrets**: Set your Razorpay and WATI secrets in Supabase:
   ```bash
   supabase secrets set RAZORPAY_SECRET=your_secret WATI_BEARER_TOKEN=your_token
   ```

## 3. Environment Variables
You need to set up `.env` files in each app. Use `.env.example` as a template.

### `apps/web/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### `apps/mobile/.env`
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Launching the Apps

You can run all apps simultaneously using Turborepo:

```bash
npx turbo dev
```

### Accessing the Platforms:
- **Buyer Web App**: [http://localhost:3000](http://localhost:3000)
- **Warehouse Dashboard**: [http://localhost:3001](http://localhost:3001)
- **Admin Panel**: [http://localhost:3002](http://localhost:3002)
- **Runner Mobile App**: Open your terminal, find the Expo QR code, and scan it with the **Expo Go** app on your phone.

## 5. Testing the Flow
1. **Login**: Go to `localhost:3000/login` and use a test phone number.
2. **Onboard as Seller**: Navigate to `/seller/onboarding` and create a store.
3. **Add Product**: Add an item to your new store via the seller dashboard.
4. **Order**: As a buyer, add that item to your cart and checkout.
5. **Fulfill**: Open the Warehouse Dashboard (`localhost:3001`) to see the order appear in real-time.
6. **Deliver**: Use the mobile app to go online as a Runner and accept the delivery.

---
**Note**: All monetary values are in paise. ₹50.00 is represented as `5000`.
