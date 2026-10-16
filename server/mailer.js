// Correos transaccionales de RemodelaUSA.
// - Siempre guarda el mensaje en la bandeja de salida (visible en /admin).
// - Si defines RESEND_API_KEY en el entorno, envía de verdad vía Resend
//   (https://resend.com — 100 correos/día gratis).
// - CAN-SPAM: cada correo lleva pie con dirección postal (OWNER_POSTAL_ADDRESS),
//   enlace de baja funcional y, si es publicidad, marca de que lo es. Las
//   bajas guardadas en `email_unsubscribes` SUPRIMEN el envío.
import { db, isEmailUnsubscribed } from './db.js';

// Remitente configurable: FROM_EMAIL (p. ej. hello@remodelausa.com) tiene
// prioridad; RESEND_FROM se mantiene por compatibilidad. Si no hay ninguno,
// se conserva el comportamiento actual (onboarding@resend.dev) — pero Omar
// debe verificar su dominio en Resend y fijar FROM_EMAIL (ver PR / .env.example).
export function resolveFrom() {
  const raw = (process.env.FROM_EMAIL || process.env.RESEND_FROM || '').trim();
  if (!raw) return 'RemodelaUSA <onboarding@resend.dev>';
  if (raw.includes('<')) return raw;
  return `RemodelaUSA <${raw}>`;
}

function publicUrl() {
  return (process.env.PUBLIC_URL || 'http://localhost:7100').replace(/\/$/, '');
}

// Pie CAN-SPAM: dirección postal física configurable (OWNER_POSTAL_ADDRESS).
// NO se inventa ninguna dirección: si no está configurada, el pie dice
// claramente que falta configurarla (pendiente de Omar).
function emailFooter(to, { commercial = false } = {}) {
  const postal = (process.env.OWNER_POSTAL_ADDRESS || '').trim();
  const postalLine = postal
    ? `Postal address: ${postal}`
    : 'Postal address: [NOT CONFIGURED — the site owner must set OWNER_POSTAL_ADDRESS]';
  const unsubscribeUrl = `${publicUrl()}/unsubscribe?email=${encodeURIComponent(to)}`;
  return [
    '',
    '---',
    'RemodelaUSA',
    postalLine,
    commercial
      ? 'This email is advertising from RemodelaUSA.'
      : 'This is a transactional message about your RemodelaUSA request or account.',
    `To stop receiving emails from RemodelaUSA, unsubscribe here: ${unsubscribeUrl}`,
    'To stop calls/texts about your project, reply STOP to any text or use the opt-out page: ' + `${publicUrl()}/opt-out`,
  ].join('\n');
}

function listUnsubscribeHeaders(to) {
  const url = `${publicUrl()}/api/unsubscribe?email=${encodeURIComponent(to)}`;
  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

export function queueEmail(to, subject, body, { commercial = false } = {}) {
  const fullBody = `${body}\n${emailFooter(to, { commercial })}`;
  if (isEmailUnsubscribed(to)) {
    // SUPRESIÓN CAN-SPAM: se registra en la bandeja como suprimido, NO se envía.
    db.prepare('INSERT INTO outbox (to_email, subject, body, sent, suppressed) VALUES (?, ?, ?, 0, 1)').run(to, subject, fullBody);
    console.log(`[outbox] SUPPRESSED (unsubscribed) → ${to} | ${subject}`);
    return { suppressed: true };
  }
  db.prepare('INSERT INTO outbox (to_email, subject, body) VALUES (?, ?, ?)').run(to, subject, fullBody);
  // Registro en consola para desarrollo
  console.log(`[outbox] → ${to} | ${subject}`);
  void sendWithResend(to, subject, fullBody);
  return { suppressed: false };
}

async function sendWithResend(to, subject, body) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = resolveFrom();
  if (!apiKey) return;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...listUnsubscribeHeaders(to),
      },
      body: JSON.stringify({ from, to: [to], subject, text: body }),
    });
    if (res.ok) {
      db.prepare('UPDATE outbox SET sent = 1 WHERE to_email = ? AND subject = ?').run(to, subject);
    } else {
      console.error('[resend] error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('[resend] falló:', err.message);
  }
}

// Reenvía un correo de la bandeja de salida por ID (botón "Reenviar" del
// panel admin). Devuelve { ok, demo, message } para mostrar en la interfaz.
// Respeta la supresión: no reenvía a quien se dio de baja.
export async function resendOutboxEmail(id) {
  const row = db.prepare('SELECT * FROM outbox WHERE id = ?').get(id);
  if (!row) return { ok: false, demo: true, message: 'Correo no encontrado en la bandeja.' };
  if (row.suppressed || isEmailUnsubscribed(row.to_email)) {
    return { ok: false, demo: false, message: 'Este destinatario se dio de baja: el envío está suprimido.' };
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = resolveFrom();
  if (!apiKey) {
    return {
      ok: false,
      demo: true,
      message: 'Resend aún no está conectado. Agrega RESEND_API_KEY en Render → Environment y vuelve a intentar.',
    };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...listUnsubscribeHeaders(row.to_email),
      },
      body: JSON.stringify({ from, to: [row.to_email], subject: row.subject, text: row.body }),
    });
    if (res.ok) {
      db.prepare('UPDATE outbox SET sent = 1 WHERE id = ?').run(id);
      return { ok: true, message: `Enviado a ${row.to_email} ✓` };
    }
    const detail = await res.text();
    console.error('[resend] error:', res.status, detail);
    return { ok: false, demo: false, message: `Resend respondió ${res.status}: ${detail.slice(0, 200)}` };
  } catch (err) {
    console.error('[resend] falló:', err.message);
    return { ok: false, demo: false, message: `Fallo de red: ${err.message}` };
  }
}

export function leadNotificationEmail({ lead, contractor }) {
  const subject = `Nuevo proyecto en ${lead.state || 'tu zona'} — ${lead.project_type}`;
  const body = [
    `Hola ${contractor.name},`,
    '',
    `Tienes un nuevo proyecto disponible en RemodelaUSA:`,
    ``,
    `Cliente: ${lead.name}`,
    `Teléfono: ${lead.phone}`,
    `Correo: ${lead.email}`,
    `Tipo de proyecto: ${lead.project_type}`,
    `Estado/Zona: ${lead.city ? lead.city + ', ' : ''}${lead.state || 'N/D'}`,
    `Fecha deseada de inicio: ${lead.start_date || 'Flexible'}`,
    ``,
    `Mensaje del cliente:`,
    lead.message || '(sin mensaje)',
    ``,
    `Responde rápido: los primeros contratistas en contactar suelen tener más oportunidades de firmar el trabajo.`,
    ``,
    `Reglas de contacto (obligatorias): el cliente aceptó ser contactado SOLO sobre este proyecto. Si te pide que no lo contactes más (STOP / "no me llames"), deja de contactarlo de inmediato y avísanos. No llames ni escribas a números en listas Do-Not-Call con fines de marketing, no compartas ni revendas los datos del cliente, y no lo contactes sobre otros servicios.`,
    ``,
    `— Equipo RemodelaUSA`,
  ].join('\n');
  return { subject, body };
}

export function contractorWelcomeEmail({ contractor }) {
  const portalUrl = `${process.env.PUBLIC_URL || 'http://localhost:7100'}/portal?token=${contractor.access_token || ''}`;
  const subject = 'Bienvenido a RemodelaUSA — completa tu perfil';
  const body = [
    `Hola ${contractor.name},`,
    '',
    `Gracias por registrarte en RemodelaUSA como contratista.`,
    ``,
    `Tu enlace personal para administrar tu perfil (guárdalo, es tu acceso):`,
    portalUrl,
    ``,
    `Próximos pasos:`,
    `1. Entra a tu portal y completa tu perfil: descripción, servicios, años de experiencia y fotos de trabajos.`,
    `2. Nuestro equipo revisará tu perfil (revisión interna de la información que publicas; NO es una verificación de licencia, seguro ni antecedentes).`,
    `3. Tu perfil aparecerá en el directorio público y empezarás a recibir solicitudes de clientes de ${contractor.state || 'tu zona'}.`,
    ``,
    `Cómo funciona el modelo (sin letra chica):`,
    `• Tu PRIMER lead de cliente es GRATIS — para que pruebes el servicio sin riesgo.`,
    `• Después, la membresía es $150/mes y te sigue enviando leads de tu zona.`,
    `• El primer mes de membresía no lleva comisión.`,
    `• Desde el segundo mes: $150/mes + 8% solo de los trabajos que firmes por RemodelaUSA.`,
    ``,
    `Reglas de contacto: contacta a cada cliente solo sobre el proyecto asignado. Si te pide no ser contactado (STOP), detente de inmediato. Respeta las listas Do-Not-Call y no compartas ni revendas los datos de los clientes.`,
    ``,
    `— Equipo RemodelaUSA`,
  ].join('\n');
  return { subject, body };
}

// Correo que acompaña al PRIMER lead gratuito: celebra el envío y explica que
// el siguiente requiere membresía (convierte el lead gratis en venta).
// Es PUBLICIDAD (commercial): lleva marca de publicidad, pie CAN-SPAM y
// respeta la supresión de bajas.
export function freeLeadEmail({ contractor }) {
  const portalUrl = `${process.env.PUBLIC_URL || 'http://localhost:7100'}/portal`;
  const subject = 'Tu primer lead GRATIS ya está en tu portal 🎉';
  const body = [
    `Hola ${contractor.name},`,
    '',
    `Buenas noticias: acabas de recibir tu primer lead de RemodelaUSA y es GRATIS, como te prometimos.`,
    ``,
    `Contacta al cliente cuanto antes — los primeros en responder suelen tener más oportunidades de firmar el trabajo.`,
    portalUrl,
    ``,
    `Para seguir recibiendo leads después de este:`,
    `• Activa tu membresía de $150/mes.`,
    `• El primer mes no lleva comisión: todo lo que firmes es tuyo.`,
    `• Desde el segundo mes: $150/mes + 8% solo de los trabajos firmados.`,
    ``,
    `Sin permanencia. Si un mes no te conviene, no renuevas y listo.`,
    ``,
    `— Equipo RemodelaUSA`,
  ].join('\n');
  return { subject, body, commercial: true };
}

// Correo cuando el contratista activa su membresía (o el admin se la activa).
export function membershipSignupEmail({ contractor, expiresAt, price }) {
  const subject = 'Membresía RemodelaUSA activa — sigue recibiendo leads';
  const body = [
    `Hola ${contractor.name},`,
    '',
    `Tu membresía de $${price}/mes está activa hasta el ${String(expiresAt || '').slice(0, 10)}.`,
    ``,
    `Recuerda cómo funciona:`,
    `• Recibes todos los leads de clientes de tu zona.`,
    `• Este primer mes no pagas comisión por trabajos.`,
    `• Desde el segundo mes: 8% solo de los trabajos que firmes por RemodelaUSA.`,
    ``,
    `— Equipo RemodelaUSA`,
  ].join('\n');
  return { subject, body };
}
