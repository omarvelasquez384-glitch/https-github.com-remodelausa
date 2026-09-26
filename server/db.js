// Base de datos SQLite (integrada en Node 22+) para RemodelaUSA.
// Guarda leads, contratistas, asignaciones, correos y ajustes.
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// DATA_DIR configurable: en hosts como Render/Railway se monta un disco
// persistente y se apunta con la variable de entorno DATA_DIR.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new DatabaseSync(path.join(DATA_DIR, 'remodelausa.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    project_type TEXT DEFAULT 'other',
    start_date TEXT DEFAULT '',
    message TEXT DEFAULT '',
    state TEXT DEFAULT '',
    city TEXT DEFAULT '',
    lang TEXT DEFAULT 'en',
    status TEXT DEFAULT 'new',
    job_value REAL DEFAULT 0,
    commission REAL DEFAULT 0,
    homeowner_id INTEGER DEFAULT 0,
    source TEXT DEFAULT 'website',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contractors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT DEFAULT '',
    trade TEXT DEFAULT 'other',
    state TEXT DEFAULT '',
    city TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT NOT NULL,
    license TEXT DEFAULT '',
    years INTEGER DEFAULT 0,
    description TEXT DEFAULT '',
    services TEXT DEFAULT '',
    website TEXT DEFAULT '',
    logo TEXT DEFAULT '',
    photos TEXT DEFAULT '[]',
    rating REAL DEFAULT 0,
    jobs_done INTEGER DEFAULT 0,
    access_token TEXT DEFAULT '',
    password_hash TEXT DEFAULT '',
    password_salt TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS homeowners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT DEFAULT '',
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_type TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    contractor_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(lead_id, contractor_id)
  );

  CREATE TABLE IF NOT EXISTS outbox (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    payload TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Ajustes por defecto
const defaults = { commission_rate: '8', avg_ticket: '10000', admin_token: '' };
for (const [key, value] of Object.entries(defaults)) {
  db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

export function getSetting(key, fallback = '') {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : fallback;
}

export function setSetting(key, value) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, String(value));
}

export function trackEvent(type, payload = {}) {
  db.prepare('INSERT INTO events (type, payload) VALUES (?, ?)').run(type, JSON.stringify(payload));
}

// Normalización robusta: minúsculas + quita tildes (baño → banho → bano)
function normKey(raw) {
  return String(raw ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const TYPE_MAP = {
  bathroom: 'bathroom', bath: 'bathroom', bano: 'bathroom', banos: 'bathroom', banheiro: 'bathroom', banheiros: 'bathroom',
  kitchen: 'kitchen', cocina: 'kitchen', cozinha: 'kitchen',
  painting: 'painting', paint: 'painting', pintura: 'painting',
  concrete: 'concrete', concreto: 'concrete',
  remodel: 'remodel', 'full remodel': 'remodel', 'remodelacion completa': 'remodel', 'reforma completa': 'remodel', remodeling: 'remodel', remodelacion: 'remodel', reforma: 'remodel',
  repair: 'repair', reparacion: 'repair', reparo: 'repair',
};

export function normalizeProjectType(raw) {
  const key = normKey(raw);
  return key ? (TYPE_MAP[key] ?? 'other') : 'other';
}

const TRADE_MAP = {
  bathroom: 'bathroom', kitchen: 'kitchen', painting: 'painting',
  concrete: 'concrete', remodel: 'remodel', repair: 'repair',
  banos: 'bathroom', bano: 'bathroom', banheiro: 'bathroom', banheiros: 'bathroom',
  cocinas: 'kitchen', cozinha: 'kitchen',
  pintura: 'painting',
  concreto: 'concrete',
  remodelacion: 'remodel', reforma: 'remodel', 'remodelacion completa': 'remodel',
  reparacion: 'repair', reparo: 'repair',
};

export function normalizeTrade(raw) {
  const key = normKey(raw);
  return key ? (TRADE_MAP[key] ?? 'other') : 'other';
}

// -----------------------------------------------------------------------------
// Contraseñas (scrypt) y sesiones de usuario
// -----------------------------------------------------------------------------
import crypto from 'node:crypto';

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 32).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, expectedHash) {
  if (!salt || !expectedHash) return false;
  const hash = crypto.scryptSync(String(password), salt, 32);
  const expected = Buffer.from(expectedHash, 'hex');
  return hash.length === expected.length && crypto.timingSafeEqual(hash, expected);
}

export function createSession(userType, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token, user_type, user_id) VALUES (?, ?, ?)').run(token, userType, userId);
  return token;
}

export function resolveSession(token) {
  if (!token) return null;
  return db.prepare('SELECT user_type, user_id FROM sessions WHERE token = ?').get(String(token)) ?? null;
}

export function destroySession(token) {
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(String(token));
}
