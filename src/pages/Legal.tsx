import { Link, useParams } from 'react-router';
import { ChevronRight, Scale } from 'lucide-react';
import { getLanguage, type Lang } from '../i18n';

// -----------------------------------------------------------------------------
// Páginas legales: /legal/privacy y /legal/terms
// Plantillas informativas — recomendamos revisión por un abogado antes de
// operar a escala. Disponibles en EN/ES/PT según el idioma activo.
// -----------------------------------------------------------------------------

type DocKind = 'privacy' | 'terms';

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
      updated: 'Last updated: September 2026',
      sections: [
        {
          heading: 'What we collect',
          body: 'When you request a quote we collect your name, email, phone number, project type, and location (if you share it). When contractors register we also collect company name, trade, state, and license number.',
        },
        {
          heading: 'How we use your information',
          body: 'Homeowner information is shared only with verified contractors assigned to your project (up to 4) so they can contact you with quotes. We never sell your personal data. Contractor information is used to verify credentials and match leads.',
        },
        {
          heading: 'Location data',
          body: 'If you allow browser geolocation, coordinates are converted to your city and state using OpenStreetMap and stored in your browser. We use it only to show contractors available in your area.',
        },
        {
          heading: 'Communications',
          body: 'We send transactional emails related to your requests (quote notifications, registration confirmations). You can request deletion of your data at any time by emailing privacy@remodelausa.com.',
        },
        {
          heading: 'Your rights',
          body: 'Depending on your state (including California under CCPA), you may request access, correction, or deletion of your personal data. Contact us and we will respond within 30 days.',
        },
      ],
      disclaimer: 'This template is provided for general information and does not constitute legal advice.',
    },
    es: {
      title: 'Política de Privacidad',
      updated: 'Última actualización: septiembre de 2026',
      sections: [
        {
          heading: 'Qué recopilamos',
          body: 'Cuando pides una cotización recopilamos tu nombre, correo, teléfono, tipo de proyecto y ubicación (si la compartes). Cuando un contratista se registra también recopilamos empresa, oficio, estado y número de licencia.',
        },
        {
          heading: 'Cómo usamos tu información',
          body: 'La información del dueño de casa se comparte solo con los contratistas verificados asignados a su proyecto (hasta 4) para que puedan contactarlo con cotizaciones. Nunca vendemos tus datos personales. La información del contratista se usa para verificar credenciales y asignar solicitudes.',
        },
        {
          heading: 'Datos de ubicación',
          body: 'Si permites la geolocalización del navegador, las coordenadas se convierten en tu ciudad y estado usando OpenStreetMap y se guardan en tu navegador. Solo las usamos para mostrar contratistas disponibles en tu zona.',
        },
        {
          heading: 'Comunicaciones',
          body: 'Enviamos correos transaccionales relacionados con tus solicitudes (avisos de cotización, confirmaciones de registro). Puedes pedir la eliminación de tus datos escribiendo a privacy@remodelausa.com.',
        },
        {
          heading: 'Tus derechos',
          body: 'Según tu estado (incluida California bajo CCPA), puedes solicitar acceso, corrección o eliminación de tus datos personales. Contáctanos y responderemos en un plazo de 30 días.',
        },
      ],
      disclaimer: 'Esta plantilla es informativa y no constituye asesoría legal.',
    },
    pt: {
      title: 'Política de Privacidade',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          heading: 'O que coletamos',
          body: 'Quando você pede um orçamento coletamos seu nome, e-mail, telefone, tipo de projeto e localização (se você compartilhar). Quando uma construtora se cadastra também coletamos empresa, especialidade, estado e número de licença.',
        },
        {
          heading: 'Como usamos suas informações',
          body: 'As informações do proprietário são compartilhadas apenas com as construtoras verificadas atribuídas ao seu projeto (até 4) para que possam contatá-lo com orçamentos. Nunca vendemos seus dados pessoais. As informações da construtora são usadas para verificar credenciais e atribuir solicitações.',
        },
        {
          heading: 'Dados de localização',
          body: 'Se você permitir a geolocalização do navegador, as coordenadas são convertidas em sua cidade e estado usando o OpenStreetMap e ficam salvas no seu navegador. Usamos esses dados apenas para mostrar construtoras disponíveis na sua região.',
        },
        {
          heading: 'Comunicações',
          body: 'Enviamos e-mails transacionais relacionados às suas solicitações (avisos de orçamento, confirmações de cadastro). Você pode solicitar a exclusão dos seus dados escrevendo para privacy@remodelausa.com.',
        },
        {
          heading: 'Seus direitos',
          body: 'Dependendo do seu estado (incluída a Califórnia sob a CCPA), você pode solicitar acesso, correção ou exclusão dos seus dados pessoais. Fale conosco e responderemos em até 30 dias.',
        },
      ],
      disclaimer: 'Este modelo é informativo e não constitui aconselhamento jurídico.',
    },
  },
  terms: {
    en: {
      title: 'Terms of Use',
      updated: 'Last updated: September 2026',
      sections: [
        {
          heading: 'The service',
          body: 'RemodelaUSA connects homeowners with independent contractors for remodeling, repair, painting, concrete, and related services across the United States. We are a referral platform, not a contractor: all work is performed by independent contractors who carry their own licenses and insurance.',
        },
        {
          heading: 'Quotes for homeowners',
          body: 'Submitting a quote request is free and carries no obligation. By submitting, you agree to be contacted by up to 4 verified contractors by phone, email, or SMS (TCPA consent). Final prices, schedules, and warranties are agreed directly between you and the contractor.',
        },
        {
          heading: 'Contractor commission',
          body: 'Contractor registration is free. By registering, contractors agree to pay a commission (currently 8%) on the total value of any job signed through a RemodelaUSA lead, payable upon contract signature with the client. Failure to report signed jobs constitutes a breach of these terms.',
        },
        {
          heading: 'Verification and quality',
          body: 'We verify contractor licenses, insurance, and background information to the best of our ability, but verification does not guarantee workmanship. Disputes about work quality must be resolved directly with the contractor, who provides written warranties.',
        },
        {
          heading: 'Limitation of liability',
          body: 'To the maximum extent permitted by law, RemodelaUSA is not liable for damages arising from work performed by contractors, and total liability for any claim is limited to the commissions paid to RemodelaUSA in the 12 months preceding the claim.',
        },
      ],
      disclaimer: 'This template is provided for general information and does not constitute legal advice.',
    },
    es: {
      title: 'Términos de Uso',
      updated: 'Última actualización: septiembre de 2026',
      sections: [
        {
          heading: 'El servicio',
          body: 'RemodelaUSA conecta dueños de casa con contratistas independientes para remodelaciones, reparaciones, pintura, concreto y servicios relacionados en Estados Unidos. Somos una plataforma de referidos, no un contratista: todo el trabajo lo realizan contratistas independientes con sus propias licencias y seguros.',
        },
        {
          heading: 'Cotizaciones para dueños de casa',
          body: 'Enviar una solicitud de cotización es gratis y sin compromiso. Al enviarla, aceptas ser contactado por hasta 4 contratistas verificados por teléfono, correo o SMS (consentimiento TCPA). Los precios finales, calendarios y garantías se acuerdan directamente entre tú y el contratista.',
        },
        {
          heading: 'Comisión del contratista',
          body: 'El registro del contratista es gratis. Al registrarse, el contratista acepta pagar una comisión (actualmente del 8%) sobre el valor total de cualquier trabajo firmado a través de un lead de RemodelaUSA, pagadera al firmar el contrato con el cliente. No reportar trabajos firmados constituye incumplimiento de estos términos.',
        },
        {
          heading: 'Verificación y calidad',
          body: 'Verificamos licencias, seguros y antecedentes de los contratistas con nuestro mejor esfuerzo, pero la verificación no garantiza la calidad de la obra. Las disputas sobre calidad deben resolverse directamente con el contratista, quien otorga garantías por escrito.',
        },
        {
          heading: 'Limitación de responsabilidad',
          body: 'En la máxima medida permitida por la ley, RemodelaUSA no es responsable de daños derivados de trabajos realizados por contratistas, y la responsabilidad total por cualquier reclamo se limita a las comisiones pagadas a RemodelaUSA en los 12 meses anteriores al reclamo.',
        },
      ],
      disclaimer: 'Esta plantilla es informativa y no constituye asesoría legal.',
    },
    pt: {
      title: 'Termos de Uso',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          heading: 'O serviço',
          body: 'A RemodelaUSA conecta proprietários a construtoras independentes para reformas, reparos, pintura, concreto e serviços relacionados nos Estados Unidos. Somos uma plataforma de indicação, não uma construtora: todo o trabalho é executado por construtoras independentes com suas próprias licenças e seguros.',
        },
        {
          heading: 'Orçamentos para proprietários',
          body: 'Enviar uma solicitação de orçamento é grátis e sem compromisso. Ao enviar, você aceita ser contatado por até 4 construtoras verificadas por telefone, e-mail ou SMS (consentimento TCPA). Preços finais, prazos e garantias são acordados diretamente entre você e a construtora.',
        },
        {
          heading: 'Comissão da construtora',
          body: 'O cadastro da construtora é grátis. Ao se cadastrar, a construtora aceita pagar uma comissão (atualmente 8%) sobre o valor total de qualquer trabalho fechado por meio de um lead da RemodelaUSA, pagável ao assinar o contrato com o cliente. Não reportar trabalhos fechados constitui violação destes termos.',
        },
        {
          heading: 'Verificação e qualidade',
          body: 'Verificamos licenças, seguros e antecedentes das construtoras com nosso melhor esforço, mas a verificação não garante a qualidade da obra. Discordâncias sobre qualidade devem ser resolvidas diretamente com a construtora, que concede garantias por escrito.',
        },
        {
          heading: 'Limitação de responsabilidade',
          body: 'Na máxima medida permitida por lei, a RemodelaUSA não se responsabiliza por danos decorrentes de trabalhos executados por construtoras, e a responsabilidade total por qualquer reclamação limita-se às comissões pagas à RemodelaUSA nos 12 meses anteriores à reclamação.',
        },
      ],
      disclaimer: 'Este modelo é informativo e não constitui aconselhamento jurídico.',
    },
  },
};

export default function Legal() {
  const { doc } = useParams<{ doc: string }>();
  const lang = getLanguage() as Lang;

  const kind: DocKind = doc === 'terms' ? 'terms' : 'privacy';
  const content = CONTENT[kind][lang] ?? CONTENT[kind].en;
  const other = kind === 'privacy' ? CONTENT.terms[lang] : CONTENT.privacy[lang];

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
        <p className="text-white/40 text-sm mb-10">{content.updated}</p>

        <div className="space-y-8">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-xl text-gold-400 mb-3">{section.heading}</h2>
              <p className="text-white/70 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 text-xs text-white/40 border-t border-white/10 pt-6">{content.disclaimer}</p>

        <p className="mt-6 text-sm">
          <Link to={kind === 'privacy' ? '/legal/terms' : '/legal/privacy'} className="text-gold-400 hover:text-gold-300 underline underline-offset-4">
            {other.title} →
          </Link>
        </p>
      </main>
    </div>
  );
}
