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
    `Recuerda: solo pagas comisión cuando firmas un trabajo.`,
    ``,
    `— Equipo RemodelaUSA`,
  ].join('\n');
  return { subject, body };
}
