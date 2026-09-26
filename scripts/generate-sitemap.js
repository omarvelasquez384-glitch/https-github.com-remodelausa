// Genera public/sitemap.xml con todas las URLs del sitio:
// home + páginas legales + 50 estados × 5 servicios.
// Uso: node scripts/generate-sitemap.js [https://tudominio.com]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'https://remodelausa.com';

// Mismos datos que src/lib/us-states.ts y src/lib/seo-data.ts
const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia',
];
const services = ['bathroom', 'kitchen', 'painting', 'concrete', 'remodel'];

const urls = [
  { loc: `${BASE}/`, priority: '1.0' },
  { loc: `${BASE}/legal/privacy`, priority: '0.3' },
  { loc: `${BASE}/legal/terms`, priority: '0.3' },
  ...states.flatMap((state) =>
    services.map((service) => ({
      loc: `${BASE}/s/${encodeURIComponent(state.toLowerCase().replace(/\s+/g, '-'))}/${service}`,
      priority: '0.8',
    }))
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;

const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(out, xml);
console.log(`sitemap.xml generado: ${urls.length} URLs → ${out}`);
