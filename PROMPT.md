# AI Prompt: Watch E-Commerce Android App

**Role:** You are a senior mobile engineer specializing in React Native and Expo.

**Objective:** Build a production-ready Android e-commerce mobile app for selling luxury watches. Do NOT build from scratch — start from a well-maintained, open-source e-commerce template/boilerplate and adapt it.

**Tech stack (required):**
- **Framework:** React Native with the **New Architecture** (Fabric + TurboModules) enabled
- **Platform tooling:** **Expo** (latest SDK, prebuild/dev-client workflow; EAS Build for Android releases)
- **Language:** **TypeScript** (strict mode)
- **Backend:** **Supabase** — Postgres database, Auth, Storage (product images), and Edge Functions where needed
- **Data layer:** **TanStack Query** for server state (caching, pagination, optimistic updates); TanStack Form if form tooling is needed
- **Bundler:** Metro (Expo default — Vite is not compatible with React Native)

**Approach:**
1. Research and recommend 2–3 actively maintained React Native/Expo e-commerce templates compatible with the New Architecture; justify the pick.
2. Scaffold from the chosen template; upgrade to the latest Expo SDK and enable the New Architecture.
3. Wire up Supabase: schema for products (watches: brand, model, price, images, specs, stock), categories, carts, orders, and user profiles; Row Level Security policies; seed data.
4. Implement core flows: browse/search/filter watches, product detail, cart, checkout, order history, auth (email + social login).
5. Use TanStack Query for all data fetching with proper cache invalidation.

**Quality requirements:**
- Strict TypeScript throughout, no `any`
- Clean folder structure (feature-based)
- Environment variables for Supabase keys (never hardcoded)
- Responsive UI, dark-mode support, smooth 60fps lists (FlashList)
- Buildable for Android via EAS; document the build/run steps in a README

**Deliverables:** working app codebase, Supabase schema/migrations, seed script, and setup documentation.
