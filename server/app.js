// API de RemodelaUSA — Express app (se monta en Vite en desarrollo y en
// el servidor de producción).
import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  db, getSetting, setSetting, trackEvent,
  normalizeProjectType, normalizeTrade,
  hashPassword, verifyPassword, createSession, resolveSession, destroySession,
} from './db.js';
import { queueEmail, leadNotificationEmail, contractorWelcomeEmail } from './mailer.js';

const VALID_LEAD_STATUS = ['new', 'contacted', 'quoted', 'signed', 'lost'];
const VALID_CONTRACTOR_STATUS = ['pending', 'active', 'suspended'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const PUBLIC_CONTRACTOR_FIELDS = `
  id, name, company, trade, state, city, phone, email, license,
  years, description, services, website, logo, photos, rating, jobs_done,
  verified, created_at
`;

function publicContractor(row) {
  return {
    ...row,
    photos: safeJson(row.photos, []),
    services: row.services ? row.services.split(',').map((s) => s.trim()).filter(Boolean) : [],
  };
}

function safeJson(text, fallback) {
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function adminToken() {
  return process.env.ADMIN_TOKEN || getSetting('admin_token') || 'remodelausa-admin';
}

export function createApiApp() {
  const app = express();
  app.use(express.json({ limit: '6mb' })); // las fotos van en base64
  // Fotos y logos subidos por los contratistas
  app.use('/uploads', express.static(UPLOAD_DIR));

  // ---- Auth simple para rutas de administración ----
  const requireAdmin = (req, res, next) => {
    const token = req.headers['x-admin-token'];
    if (token !== adminToken()) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    next();
  };

  const requireContractor = (req, res, next) => {
    const token = req.headers['x-contractor-token'];
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    const row = db.prepare('SELECT id, email, access_token FROM contractors WHERE access_token = ? OR id = ?')
      .get(String(token), Number(token) || 0);
    if (!row) return res.status(401).json({ error: 'unauthorized' });
    req.contractor = row;
    next();
  };

  // Solo el dueño del perfil: acepta sesión (token de login) o el token de
  // acceso legado que venía en el correo de bienvenida.
  const requireContractorOwner = (req, res, next) => {
    const token = String(req.headers['x-contractor-token'] ?? '');
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    const session = resolveSession(token);
    if (session?.user_type === 'contractor') {
      req.contractor = { id: session.user_id };
      return next();
    }
    const row = db.prepare('SELECT id FROM contractors WHERE access_token = ?').get(token);
    if (!row) return res.status(401).json({ error: 'unauthorized' });
    req.contractor = row;
    next();
  };

  const requireHomeowner = (req, res, next) => {
    const token = String(req.headers['x-homeowner-token'] ?? '');
    const session = resolveSession(token);
    if (session?.user_type !== 'homeowner') return res.status(401).json({ error: 'unauthorized' });
    req.homeowner = { id: session.user_id };
    next();
  };

  // ============================ SALUD =====================================
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'remodelausa-api', time: new Date().toISOString() });
  });

  // ============================ EVENTOS ===================================
  app.post('/api/events', (req, res) => {
    const { type, payload } = req.body ?? {};
    if (!type) return res.status(400).json({ error: 'type required' });
    trackEvent(String(type).slice(0, 60), payload ?? {});
    res.json({ ok: true });
  });

  // ============================ LEADS =====================================
  app.post('/api/leads', (req, res) => {
    const b = req.body ?? {};
    if (!b.name || !b.email || !b.phone) {
      return res.status(400).json({ error: 'name, email and phone are required' });
    }

    const projectType = normalizeProjectType(b.project_type);
    // Si el dueño envía con sesión iniciada, ligamos la solicitud a su cuenta
    const session = resolveSession(String(req.headers['x-homeowner-token'] ?? ''));
    const homeownerId = session?.user_type === 'homeowner' ? session.user_id : 0;
    const info = db.prepare(`
      INSERT INTO leads (name, email, phone, project_type, start_date, message, state, city, lang, source, homeowner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      String(b.name).slice(0, 120),
      String(b.email).slice(0, 160),
      String(b.phone).slice(0, 40),
      projectType,
      String(b.start_date ?? '').slice(0, 30),
      String(b.message ?? '').slice(0, 2000),
      String(b.state ?? '').slice(0, 60),
      String(b.city ?? '').slice(0, 60),
      String(b.lang ?? 'en').slice(0, 5),
      String(b.source ?? 'website').slice(0, 40),
      homeownerId,
    );

    const leadId = Number(info.lastInsertRowid);
    trackEvent('lead_submitted', { id: leadId, project_type: projectType, state: b.state ?? '' });

    // ---- Emparejamiento automático: hasta 4 contratistas ----
    const assigned = matchContractors({ projectType, state: b.state ?? '' });
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    for (const contractor of assigned) {
      db.prepare('INSERT OR IGNORE INTO assignments (lead_id, contractor_id) VALUES (?, ?)')
        .run(leadId, contractor.id);
      const { subject, body } = leadNotificationEmail({ lead, contractor });
      queueEmail(contractor.email, subject, body);
    }

    // Aviso al dueño del sitio
    queueEmail(
      process.env.OWNER_EMAIL || 'owner@remodelausa.com',
      `Nuevo lead #${leadId} — ${projectType} en ${b.state || 'N/D'}`,
      `Cliente: ${b.name} | ${b.phone} | ${b.email}\nAsignado a ${assigned.length} contratista(s).`
    );

    res.json({ ok: true, id: leadId, matched: assigned.length });
  });

  function matchContractors({ projectType, state }) {
    const stateNorm = String(state || '').toLowerCase().trim();
    let rows = [];
    if (stateNorm) {
      rows = db.prepare(`
        SELECT * FROM contractors
        WHERE status = 'active' AND lower(state) = ?
        ORDER BY (trade = ?) DESC, verified DESC, created_at ASC
        LIMIT 4
      `).all(stateNorm, projectType);
      // Sin coincidencia de oficio en ese estado: cualquier activo del estado
      if (rows.length === 0) {
        rows = db.prepare(`
          SELECT * FROM contractors WHERE status = 'active' AND lower(state) = ?
          ORDER BY verified DESC, created_at ASC LIMIT 4
        `).all(stateNorm);
      }
    }
    // Sin contratistas en el estado: los más recientes activos
    if (rows.length === 0) {
      rows = db.prepare(`
        SELECT * FROM contractors WHERE status = 'active'
        ORDER BY verified DESC, created_at ASC LIMIT 4
      `).all();
    }
    return rows;
  }

  app.get('/api/leads', requireAdmin, (req, res) => {
    const status = req.query.status ? String(req.query.status) : null;
    const rows = status
      ? db.prepare('SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC LIMIT 500').all(status)
      : db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 500').all();
    res.json(rows);
  });

  app.patch('/api/leads/:id', requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    if (!lead) return res.status(404).json({ error: 'not found' });

    const b = req.body ?? {};
    const status = b.status && VALID_LEAD_STATUS.includes(b.status) ? b.status : lead.status;
    const jobValue = b.job_value !== undefined ? Math.max(0, Number(b.job_value) || 0) : lead.job_value;

    // Comisión automática: rate% × valor del trabajo
    let commission = lead.commission;
    if (status === 'signed') {
      const rate = Number(getSetting('commission_rate', '8')) || 8;
      commission = Math.round((jobValue || Number(getSetting('avg_ticket', '10000'))) * rate) / 100;
    } else if (status !== 'signed' && b.status) {
      commission = 0;
    }

    db.prepare('UPDATE leads SET status = ?, job_value = ?, commission = ? WHERE id = ?')
      .run(status, jobValue, commission, id);
    trackEvent('lead_status', { id, status });
    res.json(db.prepare('SELECT * FROM leads WHERE id = ?').get(id));
  });

  // ========================= CONTRATISTAS =================================
  app.post('/api/contractors', (req, res) => {
    const b = req.body ?? {};
    if (!b.name || !b.email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const trade = normalizeTrade(b.trade);
    const services = Array.isArray(b.services)
      ? b.services.map((s) => normalizeTrade(s)).filter((s) => s && s !== 'other').join(',')
      : '';
    const accessToken = crypto.randomBytes(24).toString('hex');
    const { salt, hash } = b.password ? hashPassword(String(b.password)) : { salt: '', hash: '' };
    const info = db.prepare(`
      INSERT INTO contractors (name, company, trade, state, city, phone, email, license, years, description, services, website, access_token, password_hash, password_salt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      String(b.name).slice(0, 120),
      String(b.company ?? '').slice(0, 120),
      trade,
      String(b.state ?? '').slice(0, 60),
      String(b.city ?? '').slice(0, 60),
      String(b.phone ?? '').slice(0, 40),
      String(b.email).slice(0, 160),
      String(b.license ?? '').slice(0, 60),
      Math.max(0, Math.min(80, Number(b.years) || 0)),
      String(b.description ?? '').slice(0, 2000),
      services.slice(0, 300),
      String(b.website ?? '').slice(0, 200),
      accessToken,
      hash,
      salt,
    );
    const id = Number(info.lastInsertRowid);
    trackEvent('contractor_registered', { id, trade, state: b.state ?? '' });

    const contractor = db.prepare('SELECT * FROM contractors WHERE id = ?').get(id);
    const { subject, body } = contractorWelcomeEmail({ contractor });
    queueEmail(contractor.email, subject, body);

    // Si definió contraseña, iniciamos sesión de una vez
    const sessionToken = b.password ? createSession('contractor', id) : '';
    res.json({ ok: true, id, access_token: accessToken, session_token: sessionToken });
  });

  app.get('/api/contractors', requireAdmin, (_req, res) => {
    res.json(db.prepare('SELECT * FROM contractors ORDER BY created_at DESC LIMIT 500').all());
  });

  app.patch('/api/contractors/:id', requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const contractor = db.prepare('SELECT * FROM contractors WHERE id = ?').get(id);
    if (!contractor) return res.status(404).json({ error: 'not found' });
    const b = req.body ?? {};
    const status = b.status && VALID_CONTRACTOR_STATUS.includes(b.status) ? b.status : contractor.status;
    const verified = b.verified !== undefined ? (b.verified ? 1 : 0) : contractor.verified;
    const rating = b.rating !== undefined ? Math.max(0, Math.min(5, Number(b.rating) || 0)) : contractor.rating;
    const jobsDone = b.jobs_done !== undefined ? Math.max(0, Number(b.jobs_done) || 0) : contractor.jobs_done;
    db.prepare('UPDATE contractors SET status = ?, verified = ?, rating = ?, jobs_done = ? WHERE id = ?')
      .run(status, verified, rating, jobsDone, id);
    res.json(db.prepare('SELECT * FROM contractors WHERE id = ?').get(id));
  });

  // ==================== DIRECTORIO PÚBLICO DE CONTRATISTAS ==================
  // Solo perfiles activos; los verificados aparecen primero.
  app.get('/api/directory', (req, res) => {
    const state = String(req.query.state ?? '').toLowerCase().trim();
    const trade = normalizeTrade(req.query.trade);
    let rows;
    if (state && trade !== 'other') {
      rows = db.prepare(`
        SELECT ${PUBLIC_CONTRACTOR_FIELDS} FROM contractors
        WHERE status = 'active' AND lower(state) = ? AND (trade = ? OR services LIKE ?)
        ORDER BY verified DESC, rating DESC, created_at ASC LIMIT 100
      `).all(state, trade, `%${trade}%`);
    } else if (state) {
      rows = db.prepare(`
        SELECT ${PUBLIC_CONTRACTOR_FIELDS} FROM contractors
        WHERE status = 'active' AND lower(state) = ?
        ORDER BY verified DESC, rating DESC, created_at ASC LIMIT 100
      `).all(state);
    } else if (trade !== 'other') {
      rows = db.prepare(`
        SELECT ${PUBLIC_CONTRACTOR_FIELDS} FROM contractors
        WHERE status = 'active' AND (trade = ? OR services LIKE ?)
        ORDER BY verified DESC, rating DESC, created_at ASC LIMIT 100
      `).all(trade, `%${trade}%`);
    } else {
      rows = db.prepare(`
        SELECT ${PUBLIC_CONTRACTOR_FIELDS} FROM contractors
        WHERE status = 'active'
        ORDER BY verified DESC, rating DESC, created_at ASC LIMIT 100
      `).all();
    }
    res.json(rows.map(publicContractor));
  });

  app.get('/api/directory/:id', (req, res) => {
    const row = db.prepare(`
      SELECT ${PUBLIC_CONTRACTOR_FIELDS} FROM contractors
      WHERE id = ? AND status = 'active'
    `).get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(publicContractor(row));
  });

  // ===================== PORTAL DEL CONTRATISTA (/portal) ===================
  app.get('/api/me', requireContractorOwner, (req, res) => {
    const row = db.prepare('SELECT * FROM contractors WHERE id = ?').get(req.contractor.id);
    res.json(publicContractor(row));
  });

  const CONTRACTOR_EDITABLE = ['name', 'company', 'trade', 'state', 'city', 'phone', 'license', 'years', 'description', 'website'];
  app.patch('/api/me', requireContractorOwner, (req, res) => {
    const current = db.prepare('SELECT * FROM contractors WHERE id = ?').get(req.contractor.id);
    if (!current) return res.status(404).json({ error: 'not found' });
    const b = req.body ?? {};
    const next = { ...current };
    for (const key of CONTRACTOR_EDITABLE) {
      if (b[key] !== undefined) {
        next[key] = key === 'years'
          ? Math.max(0, Math.min(80, Number(b.years) || 0))
          : String(b[key]).slice(0, key === 'description' ? 2000 : 120);
      }
    }
    if (b.trade !== undefined) next.trade = normalizeTrade(b.trade);
    if (Array.isArray(b.services)) {
      next.services = b.services.map((s) => normalizeTrade(s)).filter((s) => s && s !== 'other').join(',').slice(0, 300);
    }
    if (Array.isArray(b.photos)) {
      next.photos = JSON.stringify(b.photos.map((p) => String(p).slice(0, 200)).filter((p) => p.startsWith('/uploads/')).slice(0, 8));
    }
    if (typeof b.logo === 'string' && b.logo.startsWith('/uploads/')) next.logo = b.logo.slice(0, 200);
    db.prepare(`
      UPDATE contractors SET name = ?, company = ?, trade = ?, state = ?, city = ?, phone = ?,
        license = ?, years = ?, description = ?, services = ?, website = ?, logo = ?, photos = ?
      WHERE id = ?
    `).run(next.name, next.company, next.trade, next.state, next.city, next.phone,
      next.license, next.years, next.description, next.services, next.website, next.logo, next.photos, req.contractor.id);
    trackEvent('contractor_profile_updated', { id: req.contractor.id });
    res.json(publicContractor(db.prepare('SELECT * FROM contractors WHERE id = ?').get(req.contractor.id)));
  });

  // Subida de imágenes (logo o fotos de trabajos): base64 → archivo en /uploads
  app.post('/api/upload', (req, res) => {
    const adminOk = req.headers['x-admin-token'] === adminToken();
    const token = String(req.headers['x-contractor-token'] ?? '');
    const owner = token ? db.prepare('SELECT id FROM contractors WHERE access_token = ?').get(token) : null;
    if (!adminOk && !owner) return res.status(401).json({ error: 'unauthorized' });

    const { data, name } = req.body ?? {};
    if (!data || !String(data).startsWith('data:image/')) {
      return res.status(400).json({ error: 'image data required (base64 data URL)' });
    }
    const match = String(data).match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/s);
    if (!match) return res.status(400).json({ error: 'only jpeg, png or webp images' });
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 3 * 1024 * 1024) return res.status(413).json({ error: 'image too large (max 3 MB)' });

    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const safeName = crypto.randomBytes(10).toString('hex') + '.' + ext;
    fs.writeFileSync(path.join(UPLOAD_DIR, safeName), buffer);
    trackEvent('image_uploaded', { name: safeName, by: owner ? `contractor:${owner.id}` : 'admin' });
    res.json({ ok: true, path: `/uploads/${safeName}`, name: String(name ?? '').slice(0, 120) });
  });

  // ================== SEGUIMIENTO DE SOLICITUDES DEL CLIENTE ================
  // El cliente entra su correo o teléfono y ve el estado de sus solicitudes y
  // los contratistas asignados.
  app.get('/api/my-requests', (req, res) => {
    const email = String(req.query.email ?? '').trim().toLowerCase();
    const phone = String(req.query.phone ?? '').trim();
    if (!email && !phone) return res.status(400).json({ error: 'email or phone required' });

    const leads = db.prepare(`
      SELECT id, name, project_type, state, city, status, created_at
      FROM leads
      WHERE lower(email) = ? OR phone = ?
      ORDER BY created_at DESC LIMIT 50
    `).all(email, phone);

    const result = leads.map((lead) => {
      const contractors = db.prepare(`
        SELECT c.id, c.name, c.company, c.trade, c.phone, c.email, c.rating, c.verified, c.logo, c.jobs_done, a.created_at AS assigned_at
        FROM assignments a JOIN contractors c ON c.id = a.contractor_id
        WHERE a.lead_id = ?
        ORDER BY a.created_at ASC
      `).all(lead.id);
      return { ...lead, contractors };
    });
    res.json(result);
  });

  // ========================= AUTENTICACIÓN ================================
  // Dos tipos de cuenta: 'homeowner' (dueño de casa) y 'contractor'.
  function publicUser(type, row) {
    if (type === 'contractor') {
      return {
        id: row.id, type, name: row.name, company: row.company, email: row.email,
        trade: row.trade, state: row.state, city: row.city, verified: row.verified,
        status: row.status, access_token: row.access_token,
      };
    }
    return { id: row.id, type, name: row.name, email: row.email, phone: row.phone };
  }

  app.post('/api/auth/register-homeowner', (req, res) => {
    const b = req.body ?? {};
    if (!b.name || !b.email || !b.password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    if (String(b.password).length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }
    const email = String(b.email).trim().toLowerCase().slice(0, 160);
    const existing = db.prepare('SELECT id FROM homeowners WHERE lower(email) = ?').get(email);
    if (existing) return res.status(409).json({ error: 'email already registered' });

    const { salt, hash } = hashPassword(String(b.password));
    const info = db.prepare(`
      INSERT INTO homeowners (name, email, phone, password_hash, password_salt)
      VALUES (?, ?, ?, ?, ?)
    `).run(String(b.name).slice(0, 120), email, String(b.phone ?? '').slice(0, 40), hash, salt);
    const id = Number(info.lastInsertRowid);
    trackEvent('homeowner_registered', { id });
    const token = createSession('homeowner', id);
    const row = db.prepare('SELECT * FROM homeowners WHERE id = ?').get(id);
    res.json({ ok: true, token, user: publicUser('homeowner', row) });
  });

  app.post('/api/auth/login', (req, res) => {
    const b = req.body ?? {};
    const type = b.type === 'contractor' ? 'contractor' : 'homeowner';
    const email = String(b.email ?? '').trim().toLowerCase();
    if (!email || !b.password) return res.status(400).json({ error: 'email and password are required' });

    if (type === 'contractor') {
      const row = db.prepare('SELECT * FROM contractors WHERE lower(email) = ?').get(email);
      if (!row || !verifyPassword(b.password, row.password_salt, row.password_hash)) {
        return res.status(401).json({ error: 'invalid credentials' });
      }
      trackEvent('contractor_login', { id: row.id });
      res.json({ ok: true, token: createSession('contractor', row.id), user: publicUser('contractor', row) });
    } else {
      const row = db.prepare('SELECT * FROM homeowners WHERE lower(email) = ?').get(email);
      if (!row || !verifyPassword(b.password, row.password_salt, row.password_hash)) {
        return res.status(401).json({ error: 'invalid credentials' });
      }
      trackEvent('homeowner_login', { id: row.id });
      res.json({ ok: true, token: createSession('homeowner', row.id), user: publicUser('homeowner', row) });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = String(req.headers['x-session-token'] ?? '');
    destroySession(token);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = String(req.headers['x-session-token'] ?? '');
    const session = resolveSession(token);
    if (!session) return res.status(401).json({ error: 'unauthorized' });
    if (session.user_type === 'contractor') {
      const row = db.prepare('SELECT * FROM contractors WHERE id = ?').get(session.user_id);
      if (!row) return res.status(401).json({ error: 'unauthorized' });
      return res.json({ user: publicUser('contractor', row) });
    }
    const row = db.prepare('SELECT * FROM homeowners WHERE id = ?').get(session.user_id);
    if (!row) return res.status(401).json({ error: 'unauthorized' });
    res.json({ user: publicUser('homeowner', row) });
  });

  // ============== CUENTA DEL DUEÑO DE CASA: PERFIL Y SUS SOLICITUDES ========
  app.get('/api/homeowner/leads', requireHomeowner, (req, res) => {
    const me = db.prepare('SELECT email, phone FROM homeowners WHERE id = ?').get(req.homeowner.id);
    const leads = db.prepare(`
      SELECT id, name, project_type, state, city, message, status, created_at
      FROM leads
      WHERE homeowner_id = ? OR lower(email) = ? OR phone = ?
      ORDER BY created_at DESC LIMIT 100
    `).all(req.homeowner.id, String(me.email).toLowerCase(), me.phone);
    const result = leads.map((lead) => {
      const contractors = db.prepare(`
        SELECT c.id, c.name, c.company, c.trade, c.phone, c.rating, c.verified, c.logo
        FROM assignments a JOIN contractors c ON c.id = a.contractor_id
        WHERE a.lead_id = ? ORDER BY a.created_at ASC
      `).all(lead.id);
      return { ...lead, contractors };
    });
    res.json(result);
  });

  app.patch('/api/homeowner/me', requireHomeowner, (req, res) => {
    const b = req.body ?? {};
    const current = db.prepare('SELECT * FROM homeowners WHERE id = ?').get(req.homeowner.id);
    const name = b.name !== undefined ? String(b.name).slice(0, 120) : current.name;
    const phone = b.phone !== undefined ? String(b.phone).slice(0, 40) : current.phone;
    db.prepare('UPDATE homeowners SET name = ?, phone = ? WHERE id = ?').run(name, phone, req.homeowner.id);
    res.json(publicUser('homeowner', db.prepare('SELECT * FROM homeowners WHERE id = ?').get(req.homeowner.id)));
  });

  // Vista del contratista: sus solicitudes asignadas
  app.get('/api/my-leads', requireContractor, (req, res) => {
    const rows = db.prepare(`
      SELECT l.*, a.created_at AS assigned_at FROM assignments a
      JOIN leads l ON l.id = a.lead_id
      WHERE a.contractor_id = ?
      ORDER BY a.created_at DESC LIMIT 100
    `).all(req.contractor.id);
    res.json(rows);
  });

  app.post('/api/my-leads/:leadId/status', requireContractor, (req, res) => {
    const leadId = Number(req.params.leadId);
    const own = db.prepare('SELECT id FROM assignments WHERE lead_id = ? AND contractor_id = ?')
      .get(leadId, req.contractor.id);
    if (!own) return res.status(404).json({ error: 'not found' });
    const b = req.body ?? {};
    const status = b.status && VALID_LEAD_STATUS.includes(b.status) ? b.status : null;
    if (!status) return res.status(400).json({ error: 'invalid status' });
    db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, leadId);
    res.json({ ok: true });
  });

  // =========================== MÉTRICAS ===================================
  app.get('/api/stats', requireAdmin, (_req, res) => {
    const byStatus = {};
    for (const row of db.prepare('SELECT status, COUNT(*) AS n, SUM(commission) AS commission FROM leads GROUP BY status').all()) {
      byStatus[row.status] = { count: row.n, commission: row.commission ?? 0 };
    }
    const totals = {
      leads: db.prepare('SELECT COUNT(*) AS n FROM leads').get().n,
      contractors: db.prepare('SELECT COUNT(*) AS n FROM contractors').get().n,
      activeContractors: db.prepare("SELECT COUNT(*) AS n FROM contractors WHERE status = 'active'").get().n,
      verifiedContractors: db.prepare('SELECT COUNT(*) AS n FROM contractors WHERE verified = 1').get().n,
      assignments: db.prepare('SELECT COUNT(*) AS n FROM assignments').get().n,
      commissionsTotal: db.prepare('SELECT SUM(commission) AS s FROM leads').get().s ?? 0,
      events: db.prepare('SELECT COUNT(*) AS n FROM events').get().n,
    };
    res.json({ totals, byStatus, settings: { commission_rate: getSetting('commission_rate', '8'), avg_ticket: getSetting('avg_ticket', '10000') } });
  });

  // ============================ OUTBOX ====================================
  app.get('/api/outbox', requireAdmin, (_req, res) => {
    res.json(db.prepare('SELECT * FROM outbox ORDER BY created_at DESC LIMIT 100').all());
  });

  // =========================== AJUSTES ====================================
  app.get('/api/settings', requireAdmin, (_req, res) => {
    res.json({
      commission_rate: getSetting('commission_rate', '8'),
      avg_ticket: getSetting('avg_ticket', '10000'),
      admin_token: adminToken(),
      resend: Boolean(process.env.RESEND_API_KEY),
      stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    });
  });

  app.patch('/api/settings', requireAdmin, (req, res) => {
    const b = req.body ?? {};
    if (b.commission_rate !== undefined) setSetting('commission_rate', Math.min(30, Math.max(0, Number(b.commission_rate) || 8)));
    if (b.avg_ticket !== undefined) setSetting('avg_ticket', Math.max(0, Number(b.avg_ticket) || 10000));
    if (b.admin_token !== undefined && String(b.admin_token).length >= 8) setSetting('admin_token', String(b.admin_token).slice(0, 80));
    res.json({ ok: true });
  });

  // ===================== COBRO DE COMISIÓN (Stripe) =======================
  // Si defines STRIPE_SECRET_KEY, crea una sesión de pago real para que el
  // contratista pague la comisión del lead firmado.
  app.post('/api/billing/commission/:leadId', requireAdmin, async (req, res) => {
    const leadId = Number(req.params.leadId);
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    if (!lead) return res.status(404).json({ error: 'not found' });
    const amount = Math.round((lead.commission || 0) * 100); // centavos
    if (amount <= 0) return res.status(400).json({ error: 'lead has no commission' });

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      // Modo demostración: registra la intención de cobro
      trackEvent('commission_payment_demo', { lead_id: leadId, amount_usd: lead.commission });
      return res.json({ ok: true, demo: true, message: `Define STRIPE_SECRET_KEY para cobrar ${lead.commission} USD de verdad.` });
    }

    try {
      const body = new URLSearchParams({
        mode: 'payment',
        success_url: `${req.headers.origin || 'http://localhost:7100'}/admin?paid=1`,
        cancel_url: `${req.headers.origin || 'http://localhost:7100'}/admin?paid=0`,
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][unit_amount]': String(amount),
        'line_items[0][price_data][product_data][name]': `RemodelaUSA commission — Lead #${leadId}`,
        'line_items[0][quantity]': '1',
        'metadata[lead_id]': String(leadId),
      });
      const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await r.json();
      if (!r.ok) return res.status(502).json({ error: data.error?.message ?? 'stripe error' });
      res.json({ url: data.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}
