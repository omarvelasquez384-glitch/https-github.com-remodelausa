import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Settings, Sparkles } from 'lucide-react';
import { getLanguage, type Lang } from '../i18n';
import { getStoredLocation } from './LocationBar';

// -----------------------------------------------------------------------------
// Asistente virtual integrado en la página.
// - Responde en el idioma activo (EN/ES/PT) usando una base de conocimiento
//   local con la información de RemodelaUSA.
// - Opcional: con una API key de Moonshot AI (Kimi) configurada, usa el modelo
//   real de Kimi para respuestas abiertas (configurable desde el engranaje).
// -----------------------------------------------------------------------------

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  cta?: { label: string; href: string };
}

interface Intent {
  keywords: Record<Lang, string[]>;
  answer: Record<Lang, string | ((loc: ReturnType<typeof getStoredLocation>) => string)>;
  cta?: { label: Record<Lang, string>; href: string };
}

const INTENTS: Intent[] = [
  {
    keywords: {
      en: ['price', 'cost', 'how much', 'budget', 'quote price', 'estimate', 'expensive'],
      es: ['precio', 'cuánto', 'cuanto', 'cuesta', 'costo', 'presupuesto', 'estimado', 'caro'],
      pt: ['preço', 'preco', 'quanto', 'custa', 'custo', 'orçamento', 'orcamento', 'estimado', 'caro'],
    },
    answer: {
      en: 'It depends on size and finishes. Rough ranges: painting from $1,200, bathroom from $4,500, kitchen from $12,000, concrete from $3,800, full remodels from $25,000. Use our calculator for an instant estimate based on your m² and finish level.',
      es: 'Depende del tamaño y los acabados. Rangos orientativos: pintura desde $1,200, baño desde $4,500, cocina desde $12,000, concreto desde $3,800 y remodelación completa desde $25,000. Usa nuestra calculadora para un estimado inmediato según tus m² y nivel de acabado.',
      pt: 'Depende do tamanho e dos acabamentos. Faixas de referência: pintura desde $1.200, banheiro desde $4.500, cozinha desde $12.000, concreto desde $3.800 e reforma completa desde $25.000. Use nossa calculadora para uma estimativa instantânea conforme seus m² e nível de acabamento.',
    },
    cta: { label: { en: 'Open the calculator', es: 'Abrir la calculadora', pt: 'Abrir a calculadora' }, href: '#calculadora' },
  },
  {
    keywords: {
      en: ['service', 'services', 'what do you do', 'offer', 'bathroom', 'kitchen', 'painting', 'concrete', 'repair'],
      es: ['servicio', 'servicios', 'qué hacen', 'hacen', 'baño', 'bano', 'cocina', 'pintura', 'concreto', 'reparación', 'reparacion'],
      pt: ['serviço', 'servico', 'serviços', 'servicos', 'o que fazem', 'fazem', 'banheiro', 'cozinha', 'pintura', 'concreto', 'reparo'],
    },
    answer: {
      en: 'We connect you with contractors reviewed by our team for: bathrooms, kitchens, interior and exterior painting, concrete (driveways, patios, stamped), full remodels, and home repairs.',
      es: 'Te conectamos con contratistas revisados por nuestro equipo para: baños, cocinas, pintura interior y exterior, concreto (driveways, patios, estampado), remodelaciones completas y reparaciones del hogar.',
      pt: 'Conectamos você a construtoras revisadas pela nossa equipe para: banheiros, cozinhas, pintura interna e externa, concreto (garagens, pátios, estampado), reformas completas e reparos residenciais.',
    },
  },
  {
    keywords: {
      en: ['how does it work', 'how it works', 'process', 'steps', 'start', 'get quotes'],
      es: ['cómo funciona', 'como funciona', 'proceso', 'pasos', 'empezar', 'cotizar', 'cotizaciones'],
      pt: ['como funciona', 'processo', 'passos', 'começar', 'começar', 'orçamento', 'orçar'],
    },
    answer: {
      en: 'It takes less than a minute: 1) Tell us about your project in the free quote form. 2) You receive up to 4 proposals from contractors with reviewed profiles in your area — they reply directly. 3) Compare prices and reviews. 4) Agree on price, schedule, and warranty terms directly with the contractor you choose.',
      es: 'Toma menos de un minuto: 1) Cuéntanos tu proyecto en el formulario de cotización gratis. 2) Recibes hasta 4 propuestas de contratistas con perfil revisado de tu zona — responden directo. 3) Compara precios y opiniones. 4) Acuerda precio, calendario y términos de garantía directo con el contratista que elijas.',
      pt: 'Leva menos de um minuto: 1) Conte seu projeto no formulário de orçamento grátis. 2) Você recebe até 4 propostas de construtoras com perfil revisado da sua região — elas respondem direto. 3) Compare preços e avaliações. 4) Acorde preço, prazo e termos de garantia direto com a construtora que você escolher.',
    },
    cta: { label: { en: 'Request a free quote', es: 'Pedir cotización gratis', pt: 'Pedir orçamento grátis' }, href: '#contact' },
  },
  {
    keywords: {
      en: ['contractor', 'join', 'sign up', 'registration', 'commission', 'my business', 'leads', 'work for you'],
      es: ['contratista', 'unirme', 'registro', 'registrarme', 'comisión', 'comision', 'mi negocio', 'trabajos', 'trabajar con ustedes'],
      pt: ['construtora', 'cadastro', 'cadastrar', 'comissão', 'comissao', 'meu negócio', 'trabalhos', 'trabalhar com vocês'],
    },
    answer: {
      en: 'For contractors: 1) Create your free profile — our team reviews it. 2) Your first lead is free; then membership is $150/month with no monthly cap on requests in your area. 3) Quote and sign the jobs you want. 4) First month with no commission, then 8% only on signed jobs.',
      es: 'Para contratistas: 1) Crea tu perfil gratis — nuestro equipo lo revisa. 2) Tu primer lead es gratis; luego la membresía es de $150/mes, sin tope mensual de solicitudes en tu zona. 3) Cotiza y firma los trabajos que quieras. 4) Primer mes sin comisión y desde el segundo solo 8% de los trabajos firmados.',
      pt: 'Para construtoras: 1) Crie seu perfil grátis — nossa equipe o revisa. 2) Seu primeiro lead é grátis; depois a assinatura é de US$ 150/mês, sem limite mensal de solicitações na sua região. 3) Orce e feche os trabalhos que quiser. 4) Primeiro mês sem comissão e, a partir do segundo, só 8% dos trabalhos fechados.',
    },
    cta: { label: { en: 'Join as a contractor', es: 'Unirme como contratista', pt: 'Cadastrar como construtora' }, href: '#contact' },
  },
  {
    keywords: {
      en: ['where', 'coverage', 'states', 'cities', 'near me', 'location', 'area', 'available'],
      es: ['dónde', 'donde', 'cobertura', 'estados', 'ciudades', 'cerca', 'ubicación', 'ubicacion', 'zona', 'disponibles'],
      pt: ['onde', 'cobertura', 'estados', 'cidades', 'perto', 'localização', 'localizacao', 'região', 'regiao', 'disponíveis'],
    },
    answer: {
      en: () => 'We are growing from the Kansas City area (Missouri & Kansas). Share your project in the contact form and we\'ll tell you which contractors are available in your area.',
      es: () => 'Estamos creciendo desde el área de Kansas City (Missouri y Kansas). Comparte tu proyecto en el formulario de contacto y te diremos qué contratistas hay disponibles en tu zona.',
      pt: () => 'Estamos crescendo a partir da região de Kansas City (Missouri e Kansas). Compartilhe seu projeto no formulário de contato e diremos quais construtoras estão disponíveis na sua região.',
    },
  },
  {
    keywords: {
      en: ['warranty', 'guarantee', 'protected', 'insurance'],
      es: ['garantía', 'garantia', 'protegido', 'seguro'],
      pt: ['garantia', 'protegido', 'seguro'],
    },
    answer: {
      en: 'RemodelaUSA does not set or guarantee warranty terms. Ask each contractor for the warranty they offer in writing before you sign, and confirm price, schedule, and scope in the written proposal.',
      es: 'RemodelaUSA no fija ni garantiza términos de garantía. Pide a cada contratista la garantía que ofrece por escrito antes de firmar, y confirma precio, calendario y alcance en la propuesta por escrito.',
      pt: 'A RemodelaUSA não define nem garante termos de garantia. Peça a cada construtora a garantia que ela oferece por escrito antes de assinar, e confirme preço, prazo e escopo na proposta por escrito.',
    },
  },
  {
    keywords: {
      en: ['how long', 'duration', 'time', 'days', 'weeks', 'fast', 'long does'],
      es: ['cuánto tarda', 'cuanto tarda', 'tardan', 'duración', 'duracion', 'tiempo', 'días', 'dias', 'semanas', 'rápido'],
      pt: ['quanto tempo', 'demora', 'duração', 'duracao', 'dias', 'semanas', 'rápido'],
    },
    answer: {
      en: 'Typical timelines: painting 3–5 days, concrete 1–2 weeks, bathroom 2–3 weeks, kitchen 4–6 weeks, full remodel 8–12 weeks. Your contractor confirms an exact schedule in the written proposal.',
      es: 'Tiempos típicos: pintura 3–5 días, concreto 1–2 semanas, baño 2–3 semanas, cocina 4–6 semanas y remodelación completa 8–12 semanas. Tu contratista confirma un calendario exacto en la propuesta por escrito.',
      pt: 'Prazos típicos: pintura 3–5 dias, concreto 1–2 semanas, banheiro 2–3 semanas, cozinha 4–6 semanas e reforma completa 8–12 semanas. Sua construtora confirma um cronograma exato na proposta por escrito.',
    },
  },
  {
    keywords: {
      en: ['contact', 'human', 'agent', 'phone', 'email', 'speak', 'call', 'talk'],
      es: ['contacto', 'humano', 'agente', 'teléfono', 'telefono', 'correo', 'hablar', 'llamar'],
      pt: ['contato', 'humano', 'agente', 'telefone', 'e-mail', 'email', 'falar', 'ligar'],
    },
    answer: {
      en: 'You can reach our team at hello@remodelausa.com — we reply as soon as possible. You can also send your project details through the free quote form below.',
      es: 'Puedes contactar a nuestro equipo en hola@remodelausa.com — respondemos lo antes posible. También puedes enviar los detalles de tu proyecto en el formulario de cotización gratis.',
      pt: 'Você pode falar com nossa equipe pelo ola@remodelausa.com — respondemos o quanto antes. Você também pode enviar os detalhes do seu projeto no formulário de orçamento grátis.',
    },
    cta: { label: { en: 'Open contact form', es: 'Abrir formulario', pt: 'Abrir formulário' }, href: '#contact' },
  },
];

const UI_STRINGS = {
  en: {
    title: 'Kimi — Virtual Assistant',
    subtitle: 'Ask me about prices, services, coverage…',
    greeting: 'Hello! I\'m Kimi, the RemodelaUSA assistant. Ask me anything: prices, services, how it works, or contractor registration.',
    placeholder: 'Type your question...',
    send: 'Send',
    thinking: 'Kimi is typing...',
    fallback: 'I can help with prices, services, coverage in your state, warranty terms, timelines, and contractor registration. Try one of the quick questions below, or request a free quote.',
    quick: ['How much does a bathroom cost?', 'How does it work?', 'Do you cover my area?', 'I\'m a contractor'],
    online: 'Online',
    offline: 'Offline',
    settings: 'Assistant settings',
    apiKeyLabel: 'Moonshot AI API key (optional)',
    apiKeyHint: 'With a key, the assistant uses the real Kimi model for open-ended answers. Without a key, it uses the built-in knowledge base.',
    modelLabel: 'Model',
    save: 'Save',
    saved: 'Saved',
    apiError: 'The Kimi API could not be reached (network or CORS). Using the built-in knowledge base instead.',
    clearKey: 'Remove key',
  },
  es: {
    title: 'Kimi — Asistente virtual',
    subtitle: 'Pregúntame por precios, servicios, cobertura…',
    greeting: '¡Hola! Soy Kimi, la asistente de RemodelaUSA. Pregúntame lo que quieras: precios, servicios, cómo funciona o registro de contratistas.',
    placeholder: 'Escribe tu pregunta...',
    send: 'Enviar',
    thinking: 'Kimi está escribiendo...',
    fallback: 'Puedo ayudarte con precios, servicios, cobertura en tu estado, términos de garantía, tiempos y registro de contratistas. Prueba una pregunta rápida o pide una cotización gratis.',
    quick: ['¿Cuánto cuesta un baño?', '¿Cómo funciona?', '¿Tienen cobertura en mi zona?', 'Soy contratista'],
    online: 'En línea',
    offline: 'Sin conexión',
    settings: 'Ajustes del asistente',
    apiKeyLabel: 'API key de Moonshot AI (opcional)',
    apiKeyHint: 'Con una clave, el asistente usa el modelo real de Kimi para respuestas abiertas. Sin clave, usa la base de conocimiento integrada.',
    modelLabel: 'Modelo',
    save: 'Guardar',
    saved: 'Guardado',
    apiError: 'No se pudo contactar la API de Kimi (red o CORS). Usaré la base de conocimiento integrada.',
    clearKey: 'Quitar clave',
  },
  pt: {
    title: 'Kimi — Assistente virtual',
    subtitle: 'Pergunte sobre preços, serviços, cobertura…',
    greeting: 'Olá! Sou a Kimi, a assistente da RemodelaUSA. Pergunte o que quiser: preços, serviços, como funciona ou cadastro de construtoras.',
    placeholder: 'Digite sua pergunta...',
    send: 'Enviar',
    thinking: 'Kimi está digitando...',
    fallback: 'Posso ajudar com preços, serviços, cobertura no seu estado, termos de garantia, prazos e cadastro de construtoras. Experimente uma pergunta rápida ou peça um orçamento grátis.',
    quick: ['Quanto custa um banheiro?', 'Como funciona?', 'Vocês cobrem minha região?', 'Sou construtora'],
    online: 'Online',
    offline: 'Offline',
    settings: 'Ajustes do assistente',
    apiKeyLabel: 'API key da Moonshot AI (opcional)',
    apiKeyHint: 'Com uma chave, a assistente usa o modelo real da Kimi para respostas abertas. Sem chave, usa a base de conhecimento integrada.',
    modelLabel: 'Modelo',
    save: 'Salvar',
    saved: 'Salvo',
    apiError: 'Não foi possível contatar a API da Kimi (rede ou CORS). Usarei a base de conhecimento integrada.',
    clearKey: 'Remover chave',
  },
} as const;

const API_KEY_STORAGE = 'remodelausa-kimi-key';
const API_MODEL_STORAGE = 'remodelausa-kimi-model';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function knowledgeBaseAnswer(question: string, lang: Lang, t: (typeof UI_STRINGS)[Lang]): ChatMessage {
  const text = normalize(question);
  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords[lang]) {
      if (text.includes(normalize(kw))) score += kw.length; // palabras más largas pesan más
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (!best) return { role: 'bot', text: t.fallback };

  const raw = best.answer[lang];
  const loc = getStoredLocation();
  const answerText = typeof raw === 'function' ? raw(loc) : raw;

  const cta = best.cta
    ? { label: best.cta.label[lang], href: best.cta.href }
    : undefined;

  return { role: 'bot', text: answerText, cta };
}

async function askKimi(question: string, lang: Lang, apiKey: string, model: string): Promise<string> {
  const langName = lang === 'es' ? 'Spanish' : lang === 'pt' ? 'Portuguese' : 'English';
  const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            `You are Kimi, the virtual assistant of RemodelaUSA, a marketplace connecting homeowners with remodeling contractors reviewed by our team in the Kansas City area (Missouri & Kansas). ` +
            `Services: bathrooms, kitchens, painting, concrete, full remodels, repairs. Quotes are free (up to 4 proposals); assigned contractors reply directly. ` +
            `Contractors: first lead free, then $150/month membership; first month with no commission, then 8% only on signed jobs. RemodelaUSA does not set or guarantee warranty terms: warranty terms are agreed directly between homeowner and contractor. ` +
            `Contact: hello@remodelausa.com. Answer briefly and warmly in ${langName}. If you don't know something, invite the user to the free quote form. Never invent specific prices beyond the ranges: painting from $1,200, bathroom from $4,500, kitchen from $12,000, concrete from $3,800, full remodel from $25,000.`,
        },
        { role: 'user', content: question },
      ],
    }),
  });
  if (!response.ok) throw new Error(`Kimi API error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export function ChatWidget() {
  const lang = getLanguage() as Lang;
  const t = UI_STRINGS[lang] ?? UI_STRINGS.en;

  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => window.localStorage.getItem(API_KEY_STORAGE) ?? '');
  const [modelInput, setModelInput] = useState(() => window.localStorage.getItem(API_MODEL_STORAGE) ?? 'moonshot-v1-8k');
  const [apiKey, setApiKey] = useState(() => window.localStorage.getItem(API_KEY_STORAGE) ?? '');
  const [online, setOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setTimeout(() => setMessages([{ role: 'bot', text: t.greeting }]), 400);
    }
  }, [isOpen, hasGreeted, t.greeting]);

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || isThinking) return;

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsThinking(true);

    let reply: ChatMessage;
    if (apiKey && online) {
      try {
        const answerText = await askKimi(question, lang, apiKey, modelInput);
        reply = { role: 'bot', text: answerText };
      } catch {
        reply = { ...knowledgeBaseAnswer(question, lang, t), text: `${t.apiError}\n\n${knowledgeBaseAnswer(question, lang, t).text}` };
      }
    } else {
      // Pequeña pausa para que se sienta natural
      await new Promise((r) => setTimeout(r, 650));
      reply = knowledgeBaseAnswer(question, lang, t);
    }

    setIsThinking(false);
    setMessages((prev) => [...prev, reply]);
  };

  const saveSettings = () => {
    window.localStorage.setItem(API_KEY_STORAGE, apiKeyInput.trim());
    window.localStorage.setItem(API_MODEL_STORAGE, modelInput.trim() || 'moonshot-v1-8k');
    setApiKey(apiKeyInput.trim());
    setIsSettingsOpen(false);
  };

  const clearKey = () => {
    window.localStorage.removeItem(API_KEY_STORAGE);
    setApiKeyInput('');
    setApiKey('');
  };

  return (
    <>
      {/* Botón flotante (oculto mientras el menú móvil está abierto para no
          tapar la opción "Sign in" del menú) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-fab fixed bottom-6 left-6 z-[60] w-14 h-14 rounded-full bg-gold-500 text-white flex items-center justify-center shadow-lg shadow-gold-500/25 hover:scale-110 transition-transform duration-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Panel del chat */}
      {isOpen && (
        <div className="chat-fab fixed bottom-24 left-6 z-[60] w-[calc(100vw-3rem)] max-w-sm bg-wine-800 border border-white/10 rounded-lg shadow-2xl shadow-black/60 overflow-hidden flex flex-col">
          {/* Encabezado */}
          <div className="flex items-center gap-3 px-4 py-3 bg-wine-900 border-b border-white/10">
            <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-gold-500" />
            </div>
            <div className="mr-auto min-w-0">
              <p className="text-sm text-white font-medium truncate">{t.title}</p>
              <p className="text-[11px] text-white/50 truncate flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${online ? 'bg-green-500' : 'bg-red-500'}`} />
                {online ? t.online : t.offline}
              </p>
            </div>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-1.5 text-white/50 hover:text-gold-400 transition-colors"
              aria-label={t.settings}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Ajustes */}
          {isSettingsOpen && (
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 space-y-3">
              <p className="text-xs text-gold-400 uppercase tracking-wider">{t.settings}</p>
              <div>
                <label className="block text-[11px] text-white/60 mb-1" htmlFor="chat-api-key">{t.apiKeyLabel}</label>
                <input
                  id="chat-api-key"
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-sm text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-500"
                />
                <p className="text-[11px] text-white/40 mt-1 leading-relaxed">{t.apiKeyHint}</p>
              </div>
              <div>
                <label className="block text-[11px] text-white/60 mb-1" htmlFor="chat-model">{t.modelLabel}</label>
                <input
                  id="chat-model"
                  type="text"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-sm text-white text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-gold-500 text-white text-xs rounded-sm hover:opacity-90 transition-opacity"
                >
                  {t.save}
                </button>
                {apiKey && (
                  <button
                    onClick={clearKey}
                    className="px-4 py-2 bg-white/10 text-white/70 text-xs rounded-sm hover:bg-white/20 transition-colors"
                  >
                    {t.clearKey}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mensajes */}
          <div className="h-80 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-gold-500 text-white'
                      : 'bg-white/10 text-white/90'
                  }`}
                >
                  {msg.text}
                  {msg.cta && (
                    <button
                      onClick={() => {
                        const el = document.querySelector(msg.cta!.href);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="block mt-2 text-xs text-gold-400 underline underline-offset-2 hover:text-gold-300"
                    >
                      {msg.cta.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/60 px-4 py-2.5 rounded-lg text-sm italic">
                  {t.thinking}
                </div>
              </div>
            )}

            {/* Preguntas rápidas (solo al inicio) */}
            {messages.length <= 1 && !isThinking && (
              <div className="flex flex-wrap gap-2 pt-1">
                {t.quick.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 hover:border-gold-500/40 hover:text-gold-400 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 px-3 py-3 border-t border-white/10 bg-wine-900"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 px-3 py-2.5 bg-white/5 border border-white/20 rounded-sm text-white text-sm placeholder-white/40 focus:outline-none focus:border-gold-500"
              aria-label={t.placeholder}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="w-10 h-10 rounded-sm bg-gold-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label={t.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
