import type { Lang } from '../i18n';

// Etiquetas trilingües compartidas por el directorio, el portal y el seguimiento
export const TRADE_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    bathroom: 'Bathroom', kitchen: 'Kitchen', painting: 'Painting',
    concrete: 'Concrete', remodel: 'Full remodel', repair: 'Repair', other: 'General',
  },
  es: {
    bathroom: 'Baños', kitchen: 'Cocinas', painting: 'Pintura',
    concrete: 'Concreto', remodel: 'Remodelación completa', repair: 'Reparación', other: 'General',
  },
  pt: {
    bathroom: 'Banheiros', kitchen: 'Cozinhas', painting: 'Pintura',
    concrete: 'Concreto', remodel: 'Reforma completa', repair: 'Reparo', other: 'Geral',
  },
};

export const LEAD_STATUS_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    new: 'Received', contacted: 'Contractor contacted you', quoted: 'Quote sent',
    signed: 'Contract signed', lost: 'Closed without deal',
  },
  es: {
    new: 'Recibida', contacted: 'El contratista te contactó', quoted: 'Cotización enviada',
    signed: 'Contrato firmado', lost: 'Cerrada sin acuerdo',
  },
  pt: {
    new: 'Recebida', contacted: 'A construtora entrou em contato', quoted: 'Orçamento enviado',
    signed: 'Contrato assinado', lost: 'Encerrada sem acordo',
  },
};

export const UI_LABELS = {
  en: {
    verified: 'Verified', years: (n: number) => `${n} yrs experience`,
    jobsDone: (n: number) => `${n} jobs completed`, viewProfile: 'View profile',
    requestQuote: 'Request a free quote', call: 'Call', email: 'Email',
    website: 'Website', license: 'License', services: 'Services',
    photos: 'Project photos', noResults: 'No contractors in this area yet.',
    beFirst: 'Be the first to join — registration is free.', joinNow: 'Join as a contractor',
    loading: 'Loading…', error: 'Something went wrong. Please try again.',
    notFound: 'Profile not found or not active yet.', backToDirectory: 'Back to directory',
    basedIn: 'Based in',
  },
  es: {
    verified: 'Verificado', years: (n: number) => `${n} años de experiencia`,
    jobsDone: (n: number) => `${n} trabajos realizados`, viewProfile: 'Ver perfil',
    requestQuote: 'Solicitar cotización gratis', call: 'Llamar', email: 'Correo',
    website: 'Sitio web', license: 'Licencia', services: 'Servicios',
    photos: 'Fotos de proyectos', noResults: 'Aún no hay contratistas en esta zona.',
    beFirst: 'Sé el primero en unirte — el registro es gratis.', joinNow: 'Únete como contratista',
    loading: 'Cargando…', error: 'Algo salió mal. Inténtalo de nuevo.',
    notFound: 'Perfil no encontrado o aún no activo.', backToDirectory: 'Volver al directorio',
    basedIn: 'Ubicación',
  },
  pt: {
    verified: 'Verificado', years: (n: number) => `${n} anos de experiência`,
    jobsDone: (n: number) => `${n} projetos concluídos`, viewProfile: 'Ver perfil',
    requestQuote: 'Solicitar orçamento grátis', call: 'Ligar', email: 'E-mail',
    website: 'Site', license: 'Licença', services: 'Serviços',
    photos: 'Fotos de projetos', noResults: 'Ainda não há construtoras nesta região.',
    beFirst: 'Seja o primeiro a entrar — o cadastro é grátis.', joinNow: 'Cadastre-se como construtora',
    loading: 'Carregando…', error: 'Algo deu errado. Tente novamente.',
    notFound: 'Perfil não encontrado ou ainda inativo.', backToDirectory: 'Voltar ao diretório',
    basedIn: 'Localização',
  },
} as const;

export type UiLabels = (typeof UI_LABELS)['en'];
