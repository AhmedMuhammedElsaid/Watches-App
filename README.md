# Elaraby Watches — Fine Timepieces

A luxury mobile e-commerce app for selling watches, built on the official Expo Router tabs template.
Browse a real seeded catalog (60+ Seiko watches with Arabic names and EGP prices), add to bag,
favourite items, check out, and track orders — backed by Supabase with Row Level Security.

Branding: a custom gold watch-dial logo drives the app icon, splash screen, an animated
startup sequence, and an in-app SVG logomark. Regenerate the icon/splash/favicon from the
vector source with `node scripts/gen-logo.js`.

**Stack:** React Native 0.81 (New Architecture) · Expo SDK 54 · TypeScript (strict) · Supabase (Postgres, Auth) · TanStack Query · Expo Router · expo-image (cached) · react-native-svg · Playfair Display

> SDK note: the project is pinned to SDK 54 to match the Expo Go build currently on the
> App Store. To upgrade later: `npx expo install expo@^56.0.0 --fix`.

## Features

- Browse watches in a 2-column grid with infinite scroll, pull-to-refresh, search, and category filters
- Product detail with specs, stock, and add-to-cart
- Persistent local cart (AsyncStorage) with quantity controls
- Checkout that records orders in Supabase (sign-in required)
- Order history per user, protected by Row Level Security
- Email/password auth via Supabase Auth
- Light/dark theme

## Project structure

```
app/                  Expo Router screens
  (tabs)/             Shop, Cart, Orders, Profile tabs
  watch/[id].tsx      Product detail
  checkout.tsx        Checkout (modal)
  sign-in.tsx         Auth (modal)
features/             Feature modules (auth, cart, products, orders)
lib/                  Supabase client, shared types
supabase/             SQL migrations + seed data
```

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
   Optionally also run `supabase/seed_elaraby.sql` (12 watches) and
   `supabase/seed_elaraby_more.sql` (50 more) for real Seiko watches (Arabic names,
   EGP prices, live images) sourced from elarabygroup.com.
   (Or with the Supabase CLI: `supabase db push` and `supabase db seed`.)
3. In **Authentication → Providers**, ensure Email is enabled. For quick local testing you can
   disable "Confirm email".

### 2. App

```sh
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run android        # requires an Android emulator or connected device
```

To run on a physical phone with Expo Go: `npx expo start`, then scan the QR code
(Camera app on iOS, Expo Go on Android). Phone and computer must be on the same network;
if the connection fails, use `npx expo start --tunnel`.

### Demo accounts

Run `supabase/seed_users.sql` in the Supabase SQL editor to create two confirmed test users:
`demo1@watchesapp.dev` / `demo2@watchesapp.dev` (password `Watches123!`).

### Troubleshooting

- **"Project is incompatible with this version of Expo Go"** — the Expo Go app on your phone
  supports a different SDK than the project. Check Expo Go's supported SDK on its home/settings
  screen and align the project (`npx expo install expo@^<sdk>.0.0 --fix`). After changing SDKs,
  restart the dev server with a cleared cache: `npx expo start -c`.

### Checks

```sh
npm run typecheck
npm run lint
```

## Android release build (EAS)

```sh
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```
Set the Supabase env vars as EAS secrets so they're available at build time:

```sh
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value https://csuhbtmsmiloflmrrfmd.supabase.co
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value  sb_publishable_bkH3KL286RpvUwTciHToIQ_n8FvcHfs
```

## Notes

- Payments are not wired up — checkout records a `pending` order. Integrate Stripe
  (e.g. `@stripe/stripe-react-native` + a Supabase Edge Function for PaymentIntents) to charge cards.
- The cart is device-local by design so visitors can shop before signing in; orders live in Postgres.
- Product images in the seed use picsum.photos placeholders — swap for real photos in Supabase Storage.
