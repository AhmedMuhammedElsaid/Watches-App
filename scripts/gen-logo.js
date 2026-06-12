// Generates the Elaraby Watches brand assets (app icon, adaptive icon, splash, favicon)
// from a single vector watch-dial logomark. Run: node scripts/gen-logo.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'assets', 'images');

const COLORS = {
  bg: '#0a0a0c',
  face: '#0f0e13',
  gold: '#c9a96a',
  goldLight: '#e6cd97',
  goldDeep: '#9d7c3c',
  mark: '#e8d6a8',
};

const C = 512; // canvas center (1024 viewBox)
const D2R = Math.PI / 180;
// point at angle θ (deg, clockwise from top) and radius L
const pt = (deg, L) => [C + L * Math.sin(deg * D2R), C - L * Math.cos(deg * D2R)];

// Build the watch-dial mark as SVG inner elements, sized by outer radius R.
function dial(R, { mono = false } = {}) {
  const ring = mono ? '#fff' : COLORS.gold;
  const ringHi = mono ? '#fff' : COLORS.goldLight;
  const face = mono ? 'none' : COLORS.face;
  const mark = mono ? '#fff' : COLORS.mark;
  const parts = [];

  // case rings
  parts.push(`<circle cx="${C}" cy="${C}" r="${R}" fill="${face}" stroke="${ring}" stroke-width="${R * 0.07}"/>`);
  parts.push(`<circle cx="${C}" cy="${C}" r="${R * 0.9}" fill="none" stroke="${ringHi}" stroke-width="${R * 0.012}" opacity="0.7"/>`);

  // crown at 3 o'clock
  const cw = R * 0.05;
  const ch = R * 0.17;
  parts.push(
    `<rect x="${C + R * 1.0}" y="${C - ch / 2}" width="${cw * 1.6}" height="${ch}" rx="${cw * 0.5}" fill="${ring}"/>`
  );

  // hour markers
  for (let i = 0; i < 12; i++) {
    const cardinal = i % 3 === 0;
    const [x1, y1] = pt(i * 30, R * 0.82);
    const [x2, y2] = pt(i * 30, R * 0.71);
    parts.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${mark}" stroke-width="${cardinal ? R * 0.035 : R * 0.016}" stroke-linecap="round"/>`
    );
  }

  // hands at 10:10
  const [hx, hy] = pt(305, R * 0.5);
  const [mx, my] = pt(60, R * 0.72);
  parts.push(`<line x1="${C}" y1="${C}" x2="${hx}" y2="${hy}" stroke="${mark}" stroke-width="${R * 0.05}" stroke-linecap="round"/>`);
  parts.push(`<line x1="${C}" y1="${C}" x2="${mx}" y2="${my}" stroke="${mark}" stroke-width="${R * 0.038}" stroke-linecap="round"/>`);
  // center pin
  parts.push(`<circle cx="${C}" cy="${C}" r="${R * 0.055}" fill="${ring}"/>`);
  parts.push(`<circle cx="${C}" cy="${C}" r="${R * 0.022}" fill="${mono ? '#000' : COLORS.bg}"/>`);

  return parts.join('\n  ');
}

function svg({ bg = 'none', R = 320, mono = false } = {}) {
  const bgRect = bg === 'none' ? '' : `<rect width="1024" height="1024" fill="${bg}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  ${bgRect}
  ${dial(R, { mono })}
</svg>`;
}

async function render(name, svgStr, size = 1024) {
  const file = path.join(OUT, name);
  await sharp(Buffer.from(svgStr)).resize(size, size).png().toFile(file);
  console.log('  wrote', name, `(${size}px)`);
}

(async () => {
  console.log('Generating Elaraby Watches brand assets…');
  // App icon — full-bleed dark background + gold dial
  await render('icon.png', svg({ bg: COLORS.bg, R: 360 }));
  // iOS/web favicon
  await render('favicon.png', svg({ bg: COLORS.bg, R: 360 }), 196);
  // Android adaptive icon: foreground (transparent, dial inside safe zone) + solid background
  await render('android-icon-foreground.png', svg({ bg: 'none', R: 300 }));
  await render('android-icon-background.png', `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="${COLORS.bg}"/></svg>`);
  await render('android-icon-monochrome.png', svg({ bg: 'none', R: 320, mono: true }));
  // Splash logomark (transparent — splash plugin centers it on backgroundColor)
  await render('splash-icon.png', svg({ bg: 'none', R: 300 }));
  // Reusable mark for in-app use / reference
  fs.writeFileSync(path.join(OUT, 'logo-mark.svg'), svg({ bg: 'none', R: 360 }));
  console.log('Done.');
})();
