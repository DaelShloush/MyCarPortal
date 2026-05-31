import sharp from "sharp";
import { mkdirSync } from "node:fs";

const BG = "#2c3e50";
const OUT = "public/icons";
mkdirSync(OUT, { recursive: true });

// לוגו: רקע נאבי מעוגל + אייקון רכב לבן (lucide car), ממורכז.
// scale = שיעור גודל הרכב מתוך הקנבס (קטן יותר = יותר padding ל-maskable)
function svg(size, scale = 0.5, rounded = true) {
  const icon = 24; // lucide viewBox
  const s = (size * scale) / icon; // scale factor
  const offset = (size - icon * s) / 2;
  const radius = rounded ? size * 0.22 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/>
    <g transform="translate(${offset} ${offset}) scale(${s})"
       fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </g>
  </svg>`;
}

async function png(size, scale, rounded, name) {
  await sharp(Buffer.from(svg(size, scale, rounded)))
    .png()
    .toFile(`${OUT}/${name}`);
  console.log("✓", name);
}

await png(192, 0.5, true, "icon-192.png");
await png(512, 0.5, true, "icon-512.png");
await png(512, 0.4, false, "icon-maskable-512.png"); // safe-zone padding, full-bleed bg
await png(180, 0.52, true, "apple-touch-icon.png");
console.log("done");
