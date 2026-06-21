# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Branding assets

All app icons/splash/favicon/adaptive-icon assets in `assets/images/` are generated from a
single source image, `assets/logo-samples/logo.png` (the gold watch-dial logo), via
`node scripts/gen-logo-from-png.js` (uses `sharp`). Edit the source image and rerun the
script — do not hand-edit the generated PNGs in `assets/images/`.

Notes:
- `logo.png` is a flat square with the dark background baked in (no transparent cutout), so
  the adaptive foreground / splash include the near-black square (it blends into the
  `#0a0a0c` app background). The monochrome icon is derived from brightness, not alpha.
- There is no `logo-mark.svg` anymore; the old vector generator (`gen-logo.js`) and the
  logo-concept scripts were removed. `gen-logo-from-png.js` is the single source of truth.

# Environment & config

- Supabase config comes from `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`,
  read in `lib/supabase.ts`, which throws on startup if either is missing (this crashes the
  app immediately, e.g. a built APK shows "Missing Supabase config").
- `EXPO_PUBLIC_*` vars are inlined at build time. Locally they come from `.env` (gitignored).
  For EAS builds they come from EAS environment variables (set via `eas env:create`), NOT
  from `.env` and NOT committed to git. They are registered for the `preview` and
  `production` environments; `eas.json` maps each build profile to its matching environment.
- EAS project: `@volunteering-apps/watches-brands-app` (projectId in `app.json`). App display
  name is "Branded Watches".

# Known issues

- Product images come from Elaraby's catalog. The original `seed_elaraby*.sql` URLs used the
  private S3 bucket (`elaraby-media-bucket.s3...`), which returns HTTP 403 to outside clients,
  so those never loaded. The seed files (and live `products.image_url`) now use the **public**
  storefront host `elarabygroup.com/media/...` — same image paths, but actually served (HTTP 200).
  When updating live data, run `fix-product-images.sql` in the Supabase SQL editor (RLS blocks
  writes via the anon key, so it cannot be patched from the app/client).
- `components/ProductImage.tsx` shows a branded placeholder on failed/missing load and retries
  per-URL, so swapping any `image_url` to a working public/Supabase Storage URL makes images
  appear with no code change. Use `ProductImage` (not raw `expo-image`) for product images.
- The 10 generic demo products (Seamaster/Submariner/etc. from `seed.sql`) have no Elaraby
  source and use `picsum.photos` placeholders.
