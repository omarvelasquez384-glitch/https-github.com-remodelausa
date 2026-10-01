// Correos transaccionales de RemodelaUSA.
// - Siempre guarda el mensaje en la bandeja de salida (visible en /admin).
// - Si defines RESEND_API_KEY en el entorno, envía de verdad vía Resend
//   (https://resend.com — 100 correos/día gratis).
import { db } from './db.js';

export function queueEmail(to, subject, body) {
  db.prepare('INSERT INTO outbox (to_email, subject, body) VALUES (?, ?, ?)').run(to, subject, body);
  // Registro en consola para desarrollo
  console.log(`[outbox] → ${to} | ${subject}`);
  void sendWithResend(to, subject, body);
}

async function sendWithResend(to, subject, body) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'RemodelaUSA <onboarding@resend.dev>';
  if (!apiKey) return;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
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
export async function resendOutboxEmail(id) {
  const row = db.prepare('SELECT * FROM outbox WHERE id = ?').get(id);
  if (!row) return { ok: false, demo: true, message: 'Correo no encontrado en la bandeja.' };
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'RemodelaUSA <onboarding@resend.dev>';
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
    `Responde rápido: los primeros contratistas en contactar firman más trabajos.`,
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
    `2. Nuestro equipo verificará tu licencia (${contractor.license || 'pendiente'}) y seguro.`,
    `3. Tu perfil aparecerá en el directorio público y empezarás a recibir solicitudes de clientes de ${contractor.state || 'tu zona'}.`,
    ``,
    `Cómo funciona el modelo (sin letra chica):`,
    `• Tu PRIMER lead de cliente es GRATIS — para que pruebes el servicio sin riesgo.`,
    `• Después, la membresía es $150/mes y te sigue enviando leads de tu zona.`,
    `• El primer mes de membresía no lleva comisión.`,
    `• Desde el segundo mes: $150/mes + 8% solo de los trabajos que firmes por RemodelaUSA.`,
    ``,
    `— Equipo RemodelaUSA`,
  ].join('\n');
  return { subject, body };
}

// Correo que acompaña al PRIMER lead gratuito: celebra el envío y explica que
// el siguiente requiere membresía (convierte el lead gratis en venta).
export function freeLeadEmail({ contractor }) {
  const portalUrl = `${process.env.PUBLIC_URL || 'http://localhost:7100'}/portal`;
  const subject = 'Tu primer lead GRATIS ya está en tu portal 🎉';
  const body = [
    `Hola ${contractor.name},`,
    '',
    `Buenas noticias: acabas de recibir tu primer lead de RemodelaUSA y es GRATIS, como te prometimos.`,
    ``,
    `Contacta al cliente cuanto antes — los contratistas que responden en la primera hora firman 3 veces más trabajos.`,
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
  return { subject, body };
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
