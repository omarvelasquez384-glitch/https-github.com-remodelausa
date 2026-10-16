// Textos canónicos de consentimiento TCPA (contacto por teléfono/SMS/correo).
// El texto que el usuario ve en el formulario DEBE ser exactamente uno de
// estos (por idioma). El servidor guarda el TEXTO EXACTO aceptado + la
// versión + fecha/hora + IP por cada lead, para poder demostrar el
// consentimiento después. Si el frontend manda otro texto, se guarda el
// recibido tal cual (es la evidencia de lo que se mostró) y se marca la
// versión recibida; si no manda texto, se usa el canónico del idioma.
// Versión: cambiar SIEMPRE que cambie una sola palabra del texto.
export const TCPA_CONSENT_VERSION = 'tcpa-v2-2026-10-15';

export const TCPA_CONSENT_TEXTS = {
  en: 'I agree to the Terms of Use and I consent to RemodelaUSA sharing my name, phone, email and project details with up to 4 assigned contractors, who may call or text me about my project (message/data rates may apply). Consent is not a condition of purchase. I can revoke this consent at any time by replying STOP to any text, emailing hello@remodelausa.com, or using the opt-out page at /opt-out.',
  es: 'Acepto los Términos de Uso y consiento que RemodelaUSA comparta mi nombre, teléfono, correo y detalles del proyecto con hasta 4 contratistas asignados, quienes podrán llamarme o enviarme mensajes de texto sobre mi proyecto (pueden aplicar tarifas de mensajes/datos). El consentimiento no es condición de compra. Puedo revocar este consentimiento en cualquier momento respondiendo STOP a cualquier mensaje de texto, escribiendo a hola@remodelausa.com o usando la página de baja en /opt-out.',
  pt: 'Aceito os Termos de Uso e consinto que a RemodelaUSA compartilhe meu nome, telefone, e-mail e detalhes do projeto com até 4 construtoras atribuídas, que poderão me ligar ou enviar mensagens de texto sobre o meu projeto (podem aplicar-se tarifas de mensagens/dados). O consentimento não é condição de compra. Posso revogar este consentimento a qualquer momento respondendo STOP a qualquer mensagem de texto, escrevendo para ola@remodelausa.com ou usando a página de cancelamento em /opt-out.',
};

// Resuelve qué texto + versión guardar para un lead. Devuelve el texto
// exacto que se guardará como evidencia (el recibido, o el canónico).
export function resolveConsentText(lang, providedText, providedVersion) {
  const canonical = TCPA_CONSENT_TEXTS[lang] ?? TCPA_CONSENT_TEXTS.en;
  const text = String(providedText ?? '').trim();
  if (text) {
    return { text: text.slice(0, 2000), version: String(providedVersion ?? '').slice(0, 60) || 'client-provided' };
  }
  return { text: canonical, version: TCPA_CONSENT_VERSION };
}
