import { Link, useParams } from 'react-router';
import { ChevronRight, Scale } from 'lucide-react';
import { getLanguage, type Lang } from '../i18n';

// -----------------------------------------------------------------------------
// Páginas legales: /legal/privacy, /legal/terms, /legal/cookies, /legal/refunds
// Contenido alineado con las prácticas reales auditadas del sitio (2026-10-23).
// Se recomienda revisión por un abogado (pendiente del propietario).
// Disponibles en EN/ES/PT según el idioma activo.
// -----------------------------------------------------------------------------

type DocKind = 'privacy' | 'terms' | 'cookies' | 'refunds';

interface DocContent {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
  disclaimer: string;
}

const CONTENT: Record<DocKind, Record<Lang, DocContent>> = {
  privacy: {
    en: {
      title: 'Privacy Policy',
      updated: 'Last updated: October 23, 2026',
      sections: [
        {
          heading: 'What we collect',
          body: 'When you request a quote we collect your name, email, phone number, project type, project details, and your city/state (from your browser location if you share it, or from your request). When contractors register we also collect company name, trade, service area, and license number. If you create an account, your password is stored only as a cryptographic hash — never in plain text. Contractors may also upload a logo and photos of their work.',
        },
        {
          heading: 'How we use your information',
          body: 'Homeowner information is shared only with the contractors with reviewed profiles assigned to your project (up to 4) so they can contact you with quotes. We never sell your personal data. Contractor information is used to review profiles, match requests, and administer memberships.',
        },
        {
          heading: 'Payments',
          body: 'Membership payments are processed by Stripe on Stripe\u2019s own pages. We never see or store your full card number; we receive only the payment status and the identifiers Stripe gives us to manage your membership.',
        },
        {
          heading: 'Analytics and storage in your browser',
          body: 'We count page views with our own first-party counter, stored on our own server — we do not use Google Analytics, advertising pixels, or cross-site trackers. Your browser also stores functional data: your language preference, your location if you choose to share it, sign-in tokens for contractor/admin accounts, and — only if you use the chat assistant with your own API key — that key and your model choice. See our Cookie Policy for details.',
        },
        {
          heading: 'Service providers',
          body: 'We use a small number of providers to run the service: an email delivery provider (to send assignment and account emails, which include the request details the assigned contractors need), OpenStreetMap/Nominatim (only when you use the location button, to turn coordinates into a city and state), Google Fonts (font loading; Google may receive your IP address as part of that request), and Stripe (payments). If you use the optional chat assistant with your own API key, the messages you send go to that AI provider under its own terms.',
        },
        {
          heading: 'Contractor directory',
          body: 'Contractor profiles published in our public directory show the company name, trade, service area, and the contact details the contractor provided for their profile.',
        },
        {
          heading: 'Location data',
          body: 'If you allow browser geolocation, coordinates are converted to your city and state using OpenStreetMap and stored in your browser. We use it only to show contractors available in your area.',
        },
        {
          heading: 'Communications',
          body: 'We send transactional emails related to your requests (quote notifications, registration confirmations). Every email includes an unsubscribe link and our postal address; if you unsubscribe we suppress future emails to you.',
        },
        {
          heading: 'Data retention and your rights',
          body: 'We keep request and account data while your request or account is active and as long as reasonably needed for records and dispute handling. Depending on your state (including California under the CCPA), you may request access, correction, or deletion of your personal data. Contact us at privacy@remodelausa.com and we will respond within 30 days.',
        },
        {
          heading: 'Contact',
          body: 'RemodelaUSA — Kansas City, MO, USA. Privacy questions: privacy@remodelausa.com. General contact: hello@remodelausa.com. Business mailing address: [Business mailing address — to be confirmed].',
        },
      ],
      disclaimer: 'This document is provided for general information and does not constitute legal advice. We recommend review by a licensed attorney.',
    },
    es: {
      title: 'Política de Privacidad',
      updated: 'Última actualización: 23 de octubre de 2026',
      sections: [
        {
          heading: 'Qué recopilamos',
          body: 'Cuando pides una cotización recopilamos tu nombre, correo, teléfono, tipo de proyecto, detalles del proyecto y tu ciudad/estado (de la ubicación de tu navegador si la compartes, o de tu solicitud). Cuando un contratista se registra también recopilamos empresa, oficio, zona de servicio y número de licencia. Si creas una cuenta, tu contraseña se guarda solo como hash criptográfico, nunca en texto plano. Los contratistas también pueden subir un logo y fotos de su trabajo.',
        },
        {
          heading: 'Cómo usamos tu información',
          body: 'La información del dueño de casa se comparte solo con los contratistas con perfil revisado asignados a su proyecto (hasta 4) para que puedan contactarlo con cotizaciones. Nunca vendemos tus datos personales. La información del contratista se usa para revisar perfiles, asignar solicitudes y administrar membresías.',
        },
        {
          heading: 'Pagos',
          body: 'Los pagos de membresía los procesa Stripe en sus propias páginas. Nunca vemos ni guardamos el número completo de tu tarjeta; solo recibimos el estado del pago y los identificadores que Stripe nos da para gestionar tu membresía.',
        },
        {
          heading: 'Analítica y almacenamiento en tu navegador',
          body: 'Contamos las visitas con un contador propio (first-party) guardado en nuestro servidor: no usamos Google Analytics, píxeles publicitarios ni rastreadores de terceros. Tu navegador también guarda datos funcionales: tu idioma, tu ubicación si decides compartirla, tokens de sesión de cuentas de contratista/admin y —solo si usas el asistente de chat con tu propia clave API— esa clave y tu elección de modelo. Detalles en nuestra Política de Cookies.',
        },
        {
          heading: 'Proveedores de servicio',
          body: 'Usamos unos pocos proveedores para operar el servicio: un proveedor de envío de correos (para enviar correos de asignación y de cuenta, que incluyen los datos de la solicitud que los contratistas asignados necesitan), OpenStreetMap/Nominatim (solo cuando usas el botón de ubicación, para convertir coordenadas en ciudad y estado), Google Fonts (carga de fuentes; Google puede recibir tu dirección IP en esa petición) y Stripe (pagos). Si usas el asistente de chat opcional con tu propia clave API, los mensajes que envíes van a ese proveedor de IA bajo sus propios términos.',
        },
        {
          heading: 'Directorio de contratistas',
          body: 'Los perfiles publicados en nuestro directorio público muestran el nombre de la empresa, el oficio, la zona de servicio y los datos de contacto que el contratista proporcionó para su perfil.',
        },
        {
          heading: 'Datos de ubicación',
          body: 'Si permites la geolocalización del navegador, las coordenadas se convierten en tu ciudad y estado usando OpenStreetMap y se guardan en tu navegador. Solo las usamos para mostrar contratistas disponibles en tu zona.',
        },
        {
          heading: 'Comunicaciones',
          body: 'Enviamos correos transaccionales relacionados con tus solicitudes (avisos de cotización, confirmaciones de registro). Cada correo incluye un enlace de baja y nuestra dirección postal; si te das de baja, suprimimos futuros correos a tu dirección.',
        },
        {
          heading: 'Conservación de datos y tus derechos',
          body: 'Conservamos los datos de solicitudes y cuentas mientras tu solicitud o cuenta esté activa y durante el tiempo razonable necesario para registros y resolución de disputas. Según tu estado (incluida California bajo la CCPA), puedes solicitar acceso, corrección o eliminación de tus datos personales. Escríbenos a privacy@remodelausa.com y responderemos en un plazo de 30 días.',
        },
        {
          heading: 'Contacto',
          body: 'RemodelaUSA — Kansas City, MO, EE. UU. Privacidad: privacy@remodelausa.com. Contacto general: hola@remodelausa.com. Dirección postal del negocio: [Dirección postal del negocio — pendiente de confirmar].',
        },
      ],
      disclaimer: 'Este documento es informativo y no constituye asesoría legal. Recomendamos la revisión de un abogado.',
    },
    pt: {
      title: 'Política de Privacidade',
      updated: 'Última atualização: 23 de outubro de 2026',
      sections: [
        {
          heading: 'O que coletamos',
          body: 'Quando você pede um orçamento coletamos seu nome, e-mail, telefone, tipo de projeto, detalhes do projeto e sua cidade/estado (da localização do navegador, se você compartilhar, ou do seu pedido). Quando uma construtora se cadastra também coletamos empresa, especialidade, área de atendimento e número de licença. Se você criar uma conta, sua senha é salva apenas como hash criptográfico — nunca em texto puro. Construtoras também podem enviar um logotipo e fotos do seu trabalho.',
        },
        {
          heading: 'Como usamos suas informações',
          body: 'As informações do proprietário são compartilhadas apenas com as construtoras com perfil revisado atribuídas ao seu projeto (até 4) para que possam contatá-lo com orçamentos. Nunca vendemos seus dados pessoais. As informações da construtora são usadas para revisar perfis, atribuir solicitações e administrar assinaturas.',
        },
        {
          heading: 'Pagamentos',
          body: 'Os pagamentos de assinatura são processados pela Stripe nas páginas da própria Stripe. Nunca vemos nem armazenamos o número completo do seu cartão; recebemos apenas o status do pagamento e os identificadores que a Stripe nos fornece para gerenciar sua assinatura.',
        },
        {
          heading: 'Análise e armazenamento no seu navegador',
          body: 'Contamos as visualizações de página com um contador próprio (first-party), salvo em nosso servidor — não usamos Google Analytics, pixels de publicidade nem rastreadores de terceiros. Seu navegador também guarda dados funcionais: seu idioma, sua localização se você decidir compartilhá-la, tokens de sessão de contas de construtora/admin e — apenas se você usar o assistente de chat com sua própria chave de API — essa chave e sua escolha de modelo. Veja nossa Política de Cookies para detalhes.',
        },
        {
          heading: 'Prestadores de serviço',
          body: 'Usamos poucos prestadores para operar o serviço: um provedor de envio de e-mails (para enviar e-mails de atribuição e de conta, que incluem os dados da solicitação de que as construtoras atribuídas precisam), OpenStreetMap/Nominatim (apenas quando você usa o botão de localização, para converter coordenadas em cidade e estado), Google Fonts (carregamento de fontes; o Google pode receber seu endereço IP nessa solicitação) e Stripe (pagamentos). Se você usar o assistente de chat opcional com sua própria chave de API, as mensagens que enviar vão para esse provedor de IA sob os termos dele.',
        },
        {
          heading: 'Diretório de construtoras',
          body: 'Os perfis publicados em nosso diretório público mostram o nome da empresa, a especialidade, a área de atendimento e os dados de contato que a construtora forneceu para o seu perfil.',
        },
        {
          heading: 'Dados de localização',
          body: 'Se você permitir a geolocalização do navegador, as coordenadas são convertidas em sua cidade e estado usando o OpenStreetMap e ficam salvas no seu navegador. Usamos esses dados apenas para mostrar construtoras disponíveis na sua região.',
        },
        {
          heading: 'Comunicações',
          body: 'Enviamos e-mails transacionais relacionados às suas solicitações (avisos de orçamento, confirmações de cadastro). Cada e-mail inclui um link de cancelamento e nosso endereço postal; se você cancelar, suprimimos futuros e-mails para seu endereço.',
        },
        {
          heading: 'Retenção de dados e seus direitos',
          body: 'Mantemos os dados de solicitações e contas enquanto sua solicitação ou conta estiver ativa e pelo tempo razoavelmente necessário para registros e resolução de disputas. Dependendo do seu estado (incluída a Califórnia sob a CCPA), você pode solicitar acesso, correção ou exclusão dos seus dados pessoais. Fale conosco em privacy@remodelausa.com e responderemos em até 30 dias.',
        },
        {
          heading: 'Contato',
          body: 'RemodelaUSA — Kansas City, MO, EUA. Privacidade: privacy@remodelausa.com. Contato geral: ola@remodelausa.com. Endereço postal comercial: [Endereço postal comercial — a confirmar].',
        },
      ],
      disclaimer: 'Este documento é informativo e não constitui aconselhamento jurídico. Recomendamos a revisão de um advogado.',
    },
  },
  terms: {
    en: {
      title: 'Terms of Use',
      updated: 'Last updated: October 23, 2026',
      sections: [
        {
          heading: 'The service',
          body: 'RemodelaUSA connects homeowners with independent contractors for remodeling, repair, painting, concrete, and related services in the Kansas City area (Missouri & Kansas). We are a referral platform, not a contractor, and we are not a party to the contract you sign with a contractor. All work is performed by independent contractors; RemodelaUSA is not their employer. Contractors are responsible for holding any licenses and insurance their work requires.',
        },
        {
          heading: 'Quotes for homeowners',
          body: 'Submitting a quote request is free and carries no obligation. By submitting, you consent to RemodelaUSA sharing your name, phone, email and project details with up to 4 assigned contractors, who may call or text you about your project (TCPA consent). Consent is not a condition of purchase. You can revoke it at any time by replying STOP to any text, emailing hello@remodelausa.com, or using the opt-out page at /opt-out. Final prices, schedules, and warranty terms are agreed directly between you and the contractor.',
        },
        {
          heading: 'Contractor membership and commission',
          body: 'Contractor registration is free and the first lead is free. To keep receiving leads, contractors pay a membership (currently $150/month). The first membership month carries no commission; from the second month, contractors agree to pay a commission (currently 8%) on the total value of any job signed through a RemodelaUSA lead, payable upon contract signature with the client. Failure to report signed jobs constitutes a breach of these terms. Membership cancellation and refunds are governed by our Refund Policy.',
        },
        {
          heading: 'Profile review and quality',
          body: 'Our team reviews contractor profiles before they receive requests. This review is not a verification of licenses, insurance, or background, and does not guarantee workmanship. Disputes about work quality must be resolved directly with the contractor; warranty terms are agreed directly with the contractor.',
        },
        {
          heading: 'Contractor contact rules',
          body: 'Contractors may contact a homeowner only about the project assigned to them. If a homeowner asks to stop being contacted (STOP / \u201cdo not call me\u201d), the contractor must stop immediately. Contractors must respect Do-Not-Call lists for marketing calls, must not share or resell homeowner data, and must not contact homeowners about other services.',
        },
        {
          heading: 'Content you upload',
          body: 'Contractors who upload a logo, photos, or other content represent that they own it or have permission to use it, and grant RemodelaUSA permission to display it in their profile on this site. We may remove content that infringes the rights of others or violates these terms.',
        },
        {
          heading: 'Email opt-out',
          body: 'Every email from RemodelaUSA includes an unsubscribe link and our postal address. Unsubscribing suppresses future emails to that address. Transactional messages about an active request or membership still carry the unsubscribe link.',
        },
        {
          heading: 'Limitation of liability',
          body: 'To the maximum extent permitted by law, RemodelaUSA is not liable for damages arising from work performed by contractors, and total liability for any claim is limited to the commissions paid to RemodelaUSA in the 12 months preceding the claim.',
        },
        {
          heading: 'Governing law',
          body: 'These terms are governed by the laws of the State of Missouri, USA. RemodelaUSA is operated from Kansas City, Missouri.',
        },
      ],
      disclaimer: 'This document is provided for general information and does not constitute legal advice. We recommend review by a licensed attorney.',
    },
    es: {
      title: 'Términos de Uso',
      updated: 'Última actualización: 23 de octubre de 2026',
      sections: [
        {
          heading: 'El servicio',
          body: 'RemodelaUSA conecta dueños de casa con contratistas independientes para remodelaciones, reparaciones, pintura, concreto y servicios relacionados en el área de Kansas City (Missouri y Kansas). Somos una plataforma de referidos, no un contratista, y no somos parte del contrato que firmes con un contratista. Todo el trabajo lo realizan contratistas independientes; RemodelaUSA no es su empleador. Cada contratista es responsable de contar con las licencias y seguros que su trabajo requiera.',
        },
        {
          heading: 'Cotizaciones para dueños de casa',
          body: 'Enviar una solicitud de cotización es gratis y sin compromiso. Al enviarla, consientes que RemodelaUSA comparta tu nombre, teléfono, correo y detalles del proyecto con hasta 4 contratistas asignados, quienes podrán llamarte o enviarte mensajes de texto sobre tu proyecto (consentimiento TCPA). El consentimiento no es condición de compra. Puedes revocarlo en cualquier momento respondiendo STOP a cualquier mensaje de texto, escribiendo a hola@remodelausa.com o usando la página de baja en /opt-out. Los precios finales, calendarios y términos de garantía se acuerdan directamente entre tú y el contratista.',
        },
        {
          heading: 'Membresía y comisión del contratista',
          body: 'El registro del contratista es gratis y el primer lead es gratis. Para seguir recibiendo leads, el contratista paga una membresía (actualmente de $150/mes). El primer mes de membresía no tiene comisión; desde el segundo mes, el contratista acepta pagar una comisión (actualmente del 8%) sobre el valor total de cualquier trabajo firmado a través de un lead de RemodelaUSA, pagadera al firmar el contrato con el cliente. No reportar trabajos firmados constituye incumplimiento de estos términos. La cancelación de la membresía y los reembolsos se rigen por nuestra Política de Reembolsos.',
        },
        {
          heading: 'Revisión de perfil y calidad',
          body: 'Nuestro equipo revisa los perfiles de los contratistas antes de que reciban solicitudes. Esta revisión no es una verificación de licencias, seguros ni antecedentes, y no garantiza la calidad de la obra. Las disputas sobre calidad deben resolverse directamente con el contratista; los términos de garantía se acuerdan directamente con el contratista.',
        },
        {
          heading: 'Reglas de contacto para contratistas',
          body: 'El contratista puede contactar al dueño de casa solo sobre el proyecto asignado. Si el dueño de casa pide que no lo contacten más (STOP / \u201cno me llames\u201d), el contratista debe detenerse de inmediato. Los contratistas deben respetar las listas Do-Not-Call en llamadas de marketing, no deben compartir ni revender los datos de los dueños de casa, ni contactarlos sobre otros servicios.',
        },
        {
          heading: 'Contenido que subes',
          body: 'Los contratistas que suben un logo, fotos u otro contenido declaran que son suyos o que tienen permiso para usarlos, y autorizan a RemodelaUSA a mostrarlos en su perfil en este sitio. Podemos retirar contenido que infrinja derechos de terceros o incumpla estos términos.',
        },
        {
          heading: 'Baja de correos',
          body: 'Cada correo de RemodelaUSA incluye un enlace de baja y nuestra dirección postal. Darse de baja suprime futuros correos a esa dirección. Los mensajes transaccionales sobre una solicitud o membresía activa también llevan el enlace de baja.',
        },
        {
          heading: 'Limitación de responsabilidad',
          body: 'En la máxima medida permitida por la ley, RemodelaUSA no es responsable de daños derivados de trabajos realizados por contratistas, y la responsabilidad total por cualquier reclamo se limita a las comisiones pagadas a RemodelaUSA en los 12 meses anteriores al reclamo.',
        },
        {
          heading: 'Ley aplicable',
          body: 'Estos términos se rigen por las leyes del estado de Misuri, EE. UU. RemodelaUSA opera desde Kansas City, Misuri.',
        },
      ],
      disclaimer: 'Este documento es informativo y no constituye asesoría legal. Recomendamos la revisión de un abogado.',
    },
    pt: {
      title: 'Termos de Uso',
      updated: 'Última atualização: 23 de outubro de 2026',
      sections: [
        {
          heading: 'O serviço',
          body: 'A RemodelaUSA conecta proprietários a construtoras independentes para reformas, reparos, pintura, concreto e serviços relacionados na região de Kansas City (Missouri e Kansas). Somos uma plataforma de indicação, não uma construtora, e não somos parte do contrato que você assina com uma construtora. Todo o trabalho é executado por construtoras independentes; a RemodelaUSA não é sua empregadora. Cada construtora é responsável por manter as licenças e seguros que seu trabalho exigir.',
        },
        {
          heading: 'Orçamentos para proprietários',
          body: 'Enviar uma solicitação de orçamento é grátis e sem compromisso. Ao enviar, você consente que a RemodelaUSA compartilhe seu nome, telefone, e-mail e detalhes do projeto com até 4 construtoras atribuídas, que poderão ligar ou enviar mensagens de texto sobre o seu projeto (consentimento TCPA). O consentimento não é condição de compra. Você pode revogá-lo a qualquer momento respondendo STOP a qualquer mensagem de texto, escrevendo para ola@remodelausa.com ou usando a página de cancelamento em /opt-out. Preços finais, prazos e termos de garantia são acordados diretamente entre você e a construtora.',
        },
        {
          heading: 'Assinatura e comissão da construtora',
          body: 'O cadastro da construtora é grátis e o primeiro lead é grátis. Para continuar recebendo leads, a construtora paga uma assinatura (atualmente US$ 150/mês). O primeiro mês de assinatura não tem comissão; a partir do segundo mês, a construtora aceita pagar uma comissão (atualmente 8%) sobre o valor total de qualquer trabalho fechado por meio de um lead da RemodelaUSA, pagável ao assinar o contrato com o cliente. Não reportar trabalhos fechados constitui violação destes termos. O cancelamento da assinatura e os reembolsos são regidos por nossa Política de Reembolsos.',
        },
        {
          heading: 'Revisão de perfil e qualidade',
          body: 'Nossa equipe revisa os perfis das construtoras antes de receberem solicitações. Essa revisão não é uma verificação de licenças, seguros nem antecedentes, e não garante a qualidade da obra. Discordâncias sobre qualidade devem ser resolvidas diretamente com a construtora; os termos de garantia são acordados diretamente com a construtora.',
        },
        {
          heading: 'Regras de contato para construtoras',
          body: 'A construtora pode contatar o proprietário apenas sobre o projeto atribuído. Se o proprietário pedir para não ser mais contatado (STOP / \u201cnão me ligue\u201d), a construtora deve parar imediatamente. As construtoras devem respeitar as listas Do-Not-Call em ligações de marketing, não devem compartilhar nem revender os dados dos proprietários, nem contatá-los sobre outros serviços.',
        },
        {
          heading: 'Conteúdo que você envia',
          body: 'Construtoras que enviam logotipo, fotos ou outro conteúdo declaram que são seus ou que têm permissão para usá-los, e autorizam a RemodelaUSA a exibi-los em seu perfil neste site. Podemos remover conteúdo que infrinja direitos de terceiros ou viole estes termos.',
        },
        {
          heading: 'Cancelamento de e-mails',
          body: 'Cada e-mail da RemodelaUSA inclui um link de cancelamento e nosso endereço postal. Cancelar suprime futuros e-mails para esse endereço. Mensagens transacionais sobre uma solicitação ou assinatura ativa também trazem o link de cancelamento.',
        },
        {
          heading: 'Limitação de responsabilidade',
          body: 'Na máxima medida permitida por lei, a RemodelaUSA não se responsabiliza por danos decorrentes de trabalhos executados por construtoras, e a responsabilidade total por qualquer reclamação limita-se às comissões pagas à RemodelaUSA nos 12 meses anteriores à reclamação.',
        },
        {
          heading: 'Lei aplicável',
          body: 'Estes termos são regidos pelas leis do estado do Missouri, EUA. A RemodelaUSA opera a partir de Kansas City, Missouri.',
        },
      ],
      disclaimer: 'Este documento é informativo e não constitui aconselhamento jurídico. Recomendamos a revisão de um advogado.',
    },
  },
  cookies: {
    en: {
      title: 'Cookie Policy',
      updated: 'Last updated: October 23, 2026',
      sections: [
        {
          heading: 'What cookies and browser storage are',
          body: 'Cookies are small files a website saves in your browser. Sites also use local storage for similar purposes. RemodelaUSA uses only the strictly necessary storage described below — we do not use advertising or tracking cookies.',
        },
        {
          heading: 'What we use',
          body: 'One interface cookie (sidebar_state) that remembers a layout preference. In local storage: your language preference (remodelausa-lang); your location — city, state and coordinates — only if you choose to share it (remodelausa-location); sign-in tokens for homeowner, contractor and admin accounts (remodelausa-session, remodelausa-contractor-token, remodelausa-admin-token); and, only if you use the chat assistant, your model choice and the API key you enter yourself (remodelausa-kimi-model, remodelausa-kimi-key).',
        },
        {
          heading: 'Analytics',
          body: 'We count page views with our own first-party counter stored on our own server. We do not use Google Analytics, Meta Pixel, or any third-party tracker, so there are no non-essential trackers to consent to and this site shows no cookie-consent banner.',
        },
        {
          heading: 'Third parties',
          body: 'Fonts load from Google Fonts; as part of that request Google may receive your IP address, but we do not set Google cookies. When you pay a membership, checkout happens on Stripe\u2019s pages, where Stripe may set its own cookies under its own policy. Location lookup uses OpenStreetMap/Nominatim only when you press the location button.',
        },
        {
          heading: 'Your choices',
          body: 'You can clear cookies and site storage at any time in your browser settings. Blocking this storage may sign you out or reset your language and location preferences.',
        },
      ],
      disclaimer: 'This document is provided for general information and does not constitute legal advice. We recommend review by a licensed attorney.',
    },
    es: {
      title: 'Política de Cookies',
      updated: 'Última actualización: 23 de octubre de 2026',
      sections: [
        {
          heading: 'Qué son las cookies y el almacenamiento del navegador',
          body: 'Las cookies son archivos pequeños que un sitio guarda en tu navegador. Los sitios también usan almacenamiento local con fines similares. RemodelaUSA usa solo el almacenamiento estrictamente necesario descrito abajo: no usamos cookies publicitarias ni de rastreo.',
        },
        {
          heading: 'Lo que usamos',
          body: 'Una cookie de interfaz (sidebar_state) que recuerda una preferencia de diseño. En almacenamiento local: tu idioma (remodelausa-lang); tu ubicación —ciudad, estado y coordenadas— solo si decides compartirla (remodelausa-location); tokens de sesión de cuentas de dueño de casa, contratista y admin (remodelausa-session, remodelausa-contractor-token, remodelausa-admin-token); y, solo si usas el asistente de chat, tu elección de modelo y la clave API que tú mismo introduces (remodelausa-kimi-model, remodelausa-kimi-key).',
        },
        {
          heading: 'Analítica',
          body: 'Contamos las visitas con un contador propio (first-party) guardado en nuestro servidor. No usamos Google Analytics, Meta Pixel ni ningún rastreador de terceros, así que no hay rastreadores no esenciales que consentir y este sitio no muestra banner de consentimiento de cookies.',
        },
        {
          heading: 'Terceros',
          body: 'Las fuentes cargan desde Google Fonts; en esa petición Google puede recibir tu dirección IP, pero no instalamos cookies de Google. Cuando pagas una membresía, el pago ocurre en las páginas de Stripe, donde Stripe puede instalar sus propias cookies bajo su propia política. La búsqueda de ubicación usa OpenStreetMap/Nominatim solo cuando pulsas el botón de ubicación.',
        },
        {
          heading: 'Tus opciones',
          body: 'Puedes borrar las cookies y el almacenamiento del sitio cuando quieras en los ajustes de tu navegador. Bloquear este almacenamiento puede cerrar tu sesión o restablecer tu idioma y ubicación.',
        },
      ],
      disclaimer: 'Este documento es informativo y no constituye asesoría legal. Recomendamos la revisión de un abogado.',
    },
    pt: {
      title: 'Política de Cookies',
      updated: 'Última atualização: 23 de outubro de 2026',
      sections: [
        {
          heading: 'O que são cookies e armazenamento do navegador',
          body: 'Cookies são pequenos arquivos que um site salva no seu navegador. Sites também usam armazenamento local para fins semelhantes. A RemodelaUSA usa apenas o armazenamento estritamente necessário descrito abaixo — não usamos cookies de publicidade nem de rastreamento.',
        },
        {
          heading: 'O que usamos',
          body: 'Um cookie de interface (sidebar_state) que lembra uma preferência de layout. No armazenamento local: seu idioma (remodelausa-lang); sua localização — cidade, estado e coordenadas — apenas se você decidir compartilhá-la (remodelausa-location); tokens de sessão de contas de proprietário, construtora e admin (remodelausa-session, remodelausa-contractor-token, remodelausa-admin-token); e, apenas se você usar o assistente de chat, sua escolha de modelo e a chave de API que você mesmo insere (remodelausa-kimi-model, remodelausa-kimi-key).',
        },
        {
          heading: 'Análise',
          body: 'Contamos as visualizações de página com um contador próprio (first-party) salvo em nosso servidor. Não usamos Google Analytics, Meta Pixel nem qualquer rastreador de terceiros, portanto não há rastreadores não essenciais para consentir e este site não exibe banner de consentimento de cookies.',
        },
        {
          heading: 'Terceiros',
          body: 'As fontes carregam do Google Fonts; nessa solicitação o Google pode receber seu endereço IP, mas não instalamos cookies do Google. Quando você paga uma assinatura, o pagamento acontece nas páginas da Stripe, onde a Stripe pode definir seus próprios cookies sob sua própria política. A busca de localização usa OpenStreetMap/Nominatim apenas quando você pressiona o botão de localização.',
        },
        {
          heading: 'Suas escolhas',
          body: 'Você pode limpar cookies e o armazenamento do site a qualquer momento nas configurações do navegador. Bloquear esse armazenamento pode encerrar sua sessão ou redefinir seu idioma e localização.',
        },
      ],
      disclaimer: 'Este documento é informativo e não constitui aconselhamento jurídico. Recomendamos a revisão de um advogado.',
    },
  },
  refunds: {
    en: {
      title: 'Refund Policy',
      updated: 'Last updated: October 23, 2026',
      sections: [
        {
          heading: 'Homeowners never pay for quotes',
          body: 'Requesting quotes through RemodelaUSA is always free for homeowners. This policy covers contractor memberships and commissions.',
        },
        {
          heading: 'Cancelling a membership',
          body: 'Contractors can cancel their membership at any time from the contractor portal or by emailing hello@remodelausa.com. Cancellation stops future charges; access continues until the end of the period already paid.',
        },
        {
          heading: 'Refunds',
          body: 'We do not refund the current membership period already paid, except in case of a billing error — for example a duplicate charge or a charge made after a confirmed cancellation. If you believe you were charged in error, contact us within 30 days of the charge and we will review it; approved refunds are returned to the original payment method through Stripe.',
        },
        {
          heading: 'Commissions',
          body: 'The commission applies to jobs signed through a RemodelaUSA lead, as described in the Terms of Use. If a signed job is cancelled by the client before any work begins, contact us and we will review the commission case by case.',
        },
        {
          heading: 'How to reach us',
          body: 'Email hello@remodelausa.com with your account email and the charge date. RemodelaUSA — Kansas City, MO, USA. Business mailing address: [Business mailing address — to be confirmed].',
        },
      ],
      disclaimer: 'This document is provided for general information and does not constitute legal advice. We recommend review by a licensed attorney.',
    },
    es: {
      title: 'Política de Reembolsos',
      updated: 'Última actualización: 23 de octubre de 2026',
      sections: [
        {
          heading: 'Los dueños de casa nunca pagan por cotizar',
          body: 'Pedir cotizaciones en RemodelaUSA siempre es gratis para los dueños de casa. Esta política cubre las membresías y comisiones de contratistas.',
        },
        {
          heading: 'Cancelar una membresía',
          body: 'Los contratistas pueden cancelar su membresía en cualquier momento desde el portal de contratistas o escribiendo a hola@remodelausa.com. La cancelación detiene los cobros futuros; el acceso continúa hasta el fin del periodo ya pagado.',
        },
        {
          heading: 'Reembolsos',
          body: 'No reembolsamos el periodo de membresía en curso ya pagado, salvo error de cobro —por ejemplo, un cargo duplicado o un cargo realizado tras una cancelación confirmada—. Si crees que se te cobró por error, contáctanos dentro de los 30 días siguientes al cargo y lo revisaremos; los reembolsos aprobados se devuelven al método de pago original a través de Stripe.',
        },
        {
          heading: 'Comisiones',
          body: 'La comisión aplica a trabajos firmados a través de un lead de RemodelaUSA, como describen los Términos de Uso. Si el cliente cancela un trabajo firmado antes de que comience cualquier obra, contáctanos y revisaremos la comisión caso por caso.',
        },
        {
          heading: 'Cómo contactarnos',
          body: 'Escribe a hola@remodelausa.com con el correo de tu cuenta y la fecha del cargo. RemodelaUSA — Kansas City, MO, EE. UU. Dirección postal del negocio: [Dirección postal del negocio — pendiente de confirmar].',
        },
      ],
      disclaimer: 'Este documento es informativo y no constituye asesoría legal. Recomendamos la revisión de un abogado.',
    },
    pt: {
      title: 'Política de Reembolsos',
      updated: 'Última atualização: 23 de outubro de 2026',
      sections: [
        {
          heading: 'Proprietários nunca pagam por orçamentos',
          body: 'Pedir orçamentos na RemodelaUSA é sempre grátis para proprietários. Esta política cobre assinaturas e comissões de construtoras.',
        },
        {
          heading: 'Cancelar uma assinatura',
          body: 'Construtoras podem cancelar sua assinatura a qualquer momento no portal da construtora ou escrevendo para ola@remodelausa.com. O cancelamento interrompe cobranças futuras; o acesso continua até o fim do período já pago.',
        },
        {
          heading: 'Reembolsos',
          body: 'Não reembolsamos o período de assinatura atual já pago, exceto em caso de erro de cobrança — por exemplo, uma cobrança duplicada ou feita após um cancelamento confirmado. Se você acredita que foi cobrado por engano, fale conosco em até 30 dias após a cobrança e revisaremos o caso; reembolsos aprovados são devolvidos ao método de pagamento original pela Stripe.',
        },
        {
          heading: 'Comissões',
          body: 'A comissão se aplica a trabalhos fechados por meio de um lead da RemodelaUSA, conforme os Termos de Uso. Se o cliente cancelar um trabalho fechado antes do início de qualquer obra, fale conosco e revisaremos a comissão caso a caso.',
        },
        {
          heading: 'Como falar conosco',
          body: 'Escreva para ola@remodelausa.com com o e-mail da sua conta e a data da cobrança. RemodelaUSA — Kansas City, MO, EUA. Endereço postal comercial: [Endereço postal comercial — a confirmar].',
        },
      ],
      disclaimer: 'Este documento é informativo e não constitui aconselhamento jurídico. Recomendamos a revisão de um advogado.',
    },
  },
};

const DOC_KINDS: DocKind[] = ['privacy', 'terms', 'cookies', 'refunds'];

export default function Legal() {
  const { doc } = useParams<{ doc: string }>();
  const lang = getLanguage() as Lang;

  const kind: DocKind = DOC_KINDS.includes(doc as DocKind) ? (doc as DocKind) : 'privacy';
  const content = CONTENT[kind][lang] ?? CONTENT[kind].en;
  const others = DOC_KINDS.filter((k) => k !== kind);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-gold-400 hover:text-gold-300 font-serif text-lg mr-4">RemodelaUSA</Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/90">{content.title}</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="w-7 h-7 text-gold-500" />
          <h1 className="font-serif text-3xl lg:text-4xl text-white">{content.title}</h1>
        </div>
        <p className="text-white/60 text-sm mb-10">{content.updated}</p>

        <div className="space-y-8">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-xl text-gold-400 mb-3">{section.heading}</h2>
              <p className="text-white/70 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 text-xs text-white/50 border-t border-white/10 pt-6">{content.disclaimer}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {others.map((k) => (
            <Link
              key={k}
              to={`/legal/${k}`}
              className="text-gold-400 hover:text-gold-300 underline underline-offset-4"
            >
              {(CONTENT[k][lang] ?? CONTENT[k].en).title} →
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
