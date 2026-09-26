// Servidor de producción: sirve la API + el build estático (dist/).
// Uso:  npm run build && npm start
// Puerto: process.env.PORT o 3001.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApiApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(createApiApp());

const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback: cualquier ruta que no sea /api devuelve index.html
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.send('RemodelaUSA API en línea. Ejecuta "npm run build" para servir el sitio.');
  });
}

app.listen(PORT, () => {
  console.log(`RemodelaUSA (producción) → http://localhost:${PORT}`);
});
