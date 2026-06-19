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
