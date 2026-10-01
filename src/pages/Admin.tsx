import { useState, useEffect, useCallback } from 'react';
import {
  Home, Users, Mail, BarChart3, LogOut, CheckCircle, Clock,
  ExternalLink, Loader2, ShieldCheck, CreditCard, FileText,
} from 'lucide-react';
import {
  adminApi, getAdminToken, setAdminToken,
  type LeadRecord, type ContractorRecord,
} from '../lib/api';
import { getLanguage, type Lang } from '../i18n';

// -----------------------------------------------------------------------------
// Panel de administración de RemodelaUSA (/admin)
// Gestiona leads, contratistas, comisiones, correos y ajustes del negocio.
// -----------------------------------------------------------------------------

type Tab = 'overview' | 'leads' | 'contractors' | 'outbox' | 'settings';

const STRINGS = {
  en: {
    title: 'RemodelaUSA — Admin',
    tokenPrompt: 'Enter your admin token',
    tokenHint: 'Default: remodelausa-admin (change it in Settings)',
    enter: 'Enter',
    wrongToken: 'Invalid token. Try again.',
    tabs: { overview: 'Overview', leads: 'Leads', contractors: 'Contractors', outbox: 'Outbox', settings: 'Settings' },
    logout: 'Log out',
    backToSite: 'View site',
    totalLeads: 'Total leads',
    newLeads: 'New',
    signedJobs: 'Signed jobs',
    projectedCommissions: 'Commissions earned',
    activeContractors: 'Active contractors',
    verifiedContractors: 'Verified',
    byStatus: 'Pipeline by status',
    status: { new: 'New', contacted: 'Contacted', quoted: 'Quoted', signed: 'Signed', lost: 'Lost' },
    leadsTable: {
      id: '#', name: 'Name', contact: 'Contact', type: 'Type', location: 'Location',
      status: 'Status', jobValue: 'Job value ($)', commission: 'Commission', actions: 'Collect',
      noLeads: 'No leads yet. Submit the public form to see them here.',
      demoCollected: 'Demo mode: set STRIPE_SECRET_KEY to charge for real.',
      collected: 'Checkout link created',
    },
    contractorsTable: {
      noContractors: 'No contractors registered yet.',
      verify: 'Verify', unverify: 'Unverify', activate: 'Activate', suspend: 'Suspend',
    },
    outboxEmpty: 'No emails queued yet.',
    settings: {
      commissionRate: 'Commission rate (%)',
      avgTicket: 'Average job value ($)',
      adminToken: 'Admin token (min 8 chars)',
      save: 'Save settings',
      saved: 'Saved ✓',
      resendOn: 'Resend email: connected',
      resendOff: 'Resend email: not configured (set RESEND_API_KEY)',
      stripeOn: 'Stripe: connected',
      stripeOff: 'Stripe: not configured (set STRIPE_SECRET_KEY)',
    },
  },
  es: {
    title: 'RemodelaUSA — Administración',
    tokenPrompt: 'Introduce tu token de administrador',
    tokenHint: 'Por defecto: remodelausa-admin (cámbialo en Ajustes)',
    enter: 'Entrar',
    wrongToken: 'Token inválido. Inténtalo de nuevo.',
    tabs: { overview: 'Resumen', leads: 'Leads', contractors: 'Contratistas', outbox: 'Correos', settings: 'Ajustes' },
    logout: 'Salir',
    backToSite: 'Ver sitio',
    totalLeads: 'Leads totales',
    newLeads: 'Nuevos',
    signedJobs: 'Trabajos firmados',
    projectedCommissions: 'Comisiones ganadas',
    activeContractors: 'Contratistas activos',
    verifiedContractors: 'Verificados',
    byStatus: 'Embudo por estado',
    status: { new: 'Nuevo', contacted: 'Contactado', quoted: 'Cotizado', signed: 'Firmado', lost: 'Perdido' },
    leadsTable: {
      id: '#', name: 'Nombre', contact: 'Contacto', type: 'Tipo', location: 'Ubicación',
      status: 'Estado', jobValue: 'Valor del trabajo ($)', commission: 'Comisión', actions: 'Cobrar',
      noLeads: 'Aún no hay leads. Envía el formulario público para verlos aquí.',
      demoCollected: 'Modo demo: define STRIPE_SECRET_KEY para cobrar de verdad.',
      collected: 'Enlace de pago creado',
    },
    contractorsTable: {
      noContractors: 'Aún no hay contratistas registrados.',
      verify: 'Verificar', unverify: 'Quitar verif.', activate: 'Activar', suspend: 'Suspender',
    },
    outboxEmpty: 'Aún no hay correos en la bandeja.',
    settings: {
      commissionRate: 'Tasa de comisión (%)',
      avgTicket: 'Valor promedio del trabajo ($)',
      adminToken: 'Token de administrador (mín. 8 caracteres)',
      save: 'Guardar ajustes',
      saved: 'Guardado ✓',
      resendOn: 'Correos Resend: conectado',
      resendOff: 'Correos Resend: no configurado (define RESEND_API_KEY)',
      stripeOn: 'Stripe: conectado',
      stripeOff: 'Stripe: no configurado (define STRIPE_SECRET_KEY)',
    },
  },
  pt: {
    title: 'RemodelaUSA — Administração',
    tokenPrompt: 'Digite seu token de administrador',
    tokenHint: 'Padrão: remodelausa-admin (altere em Ajustes)',
    enter: 'Entrar',
    wrongToken: 'Token inválido. Tente novamente.',
    tabs: { overview: 'Resumo', leads: 'Leads', contractors: 'Construtoras', outbox: 'E-mails', settings: 'Ajustes' },
    logout: 'Sair',
    backToSite: 'Ver site',
    totalLeads: 'Leads totais',
    newLeads: 'Novos',
    signedJobs: 'Trabalhos fechados',
    projectedCommissions: 'Comissões ganhas',
    activeContractors: 'Construtoras ativas',
    verifiedContractors: 'Verificadas',
    byStatus: 'Funil por status',
    status: { new: 'Novo', contacted: 'Contatado', quoted: 'Orçado', signed: 'Fechado', lost: 'Perdido' },
    leadsTable: {
      id: '#', name: 'Nome', contact: 'Contato', type: 'Tipo', location: 'Localização',
      status: 'Status', jobValue: 'Valor do trabalho ($)', commission: 'Comissão', actions: 'Cobrar',
      noLeads: 'Ainda não há leads. Envie o formulário público para vê-los aqui.',
      demoCollected: 'Modo demo: defina STRIPE_SECRET_KEY para cobrar de verdade.',
      collected: 'Link de pagamento criado',
    },
    contractorsTable: {
      noContractors: 'Ainda não há construtoras registradas.',
      verify: 'Verificar', unverify: 'Remover verif.', activate: 'Ativar', suspend: 'Suspender',
    },
    outboxEmpty: 'Ainda não há e-mails na bandeja.',
    settings: {
      commissionRate: 'Taxa de comissão (%)',
      avgTicket: 'Valor médio do trabalho ($)',
      adminToken: 'Token de administrador (mín. 8 caracteres)',
      save: 'Salvar ajustes',
      saved: 'Salvo ✓',
      resendOn: 'E-mails Resend: conectado',
      resendOff: 'E-mails Resend: não configurado (defina RESEND_API_KEY)',
      stripeOn: 'Stripe: conectado',
      stripeOff: 'Stripe: não configurado (defina STRIPE_SECRET_KEY)',
    },
  },
} as const;

const fmtUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  contacted: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  quoted: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  signed: 'bg-green-500/15 text-green-400 border-green-500/30',
  lost: 'bg-white/10 text-white/40 border-white/20',
};

export default function Admin() {
  const lang = getLanguage() as Lang;
  const t = STRINGS[lang] ?? STRINGS.en;

  const [tokenInput, setTokenInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.stats>> | null>(null);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [contractors, setContractors] = useState<ContractorRecord[]>([]);
  const [outbox, setOutbox] = useState<{ id: number; to_email: string; subject: string; body: string; sent: number; created_at: string }[]>([]);
  const [settingsInfo, setSettingsInfo] = useState<{ commission_rate: string; avg_ticket: string; admin_token: string; resend: boolean; stripe: boolean } | null>(null);
  const [settingsForm, setSettingsForm] = useState({ commission_rate: '8', avg_ticket: '10000', membership_price: '150', admin_token: '' });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [leadFilter, setLeadFilter] = useState('');
  const [collectingId, setCollectingId] = useState<number | null>(null);
  const [collectMsg, setCollectMsg] = useState('');
  const [membershipMsg, setMembershipMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, l, c] = await Promise.all([adminApi.stats(), adminApi.leads(), adminApi.contractors()]);
      setStats(s);
      setLeads(l);
      setContractors(c);
      setAuthError(false);
    } catch {
      setAuthed(false);
      setAdminToken('');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab]);

  useEffect(() => {
    if (authed && tab === 'outbox') {
      adminApi.outbox().then(setOutbox).catch(() => {});
    }
    if (authed && tab === 'settings') {
      adminApi.settings().then((s) => {
        setSettingsInfo(s);
        setSettingsForm({ commission_rate: s.commission_rate, avg_ticket: s.avg_ticket, membership_price: s.membership_price ?? '150', admin_token: '' });
      }).catch(() => {});
    }
  }, [authed, tab]);

  // Intentar token guardado al cargar
  useEffect(() => {
    if (getAdminToken()) {
      setAuthed(true); // load() valida y desloguea si es inválido
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminToken(tokenInput.trim());
    try {
      await adminApi.stats();
      setAuthed(true);
      setAuthError(false);
    } catch {
      setAuthError(true);
      setAdminToken('');
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    await adminApi.updateLead(id, { status });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    void load();
  };

  const updateLeadValue = async (id: number, jobValue: number) => {
    await adminApi.updateLead(id, { job_value: jobValue });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, job_value: jobValue } : l)));
  };

  const collectCommission = async (id: number) => {
    setCollectingId(id);
    setCollectMsg('');
    try {
      const r = await adminApi.commissionCheckout(id);
      if (r.url) {
        window.open(r.url, '_blank');
        setCollectMsg(t.leadsTable.collected);
      } else if (r.demo) {
        setCollectMsg(t.leadsTable.demoCollected);
      }
      void load();
    } catch {
      setCollectMsg(t.leadsTable.demoCollected);
    }
    setCollectingId(null);
    setTimeout(() => setCollectMsg(''), 6000);
  };

  const updateContractor = async (id: number, body: { status?: string; verified?: boolean; rating?: number; jobs_done?: number }) => {
    await adminApi.updateContractor(id, body);
    setContractors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...body, verified: body.verified !== undefined ? (body.verified ? 1 : 0) : c.verified } : c))
    );
    void load();
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.saveSettings({
      commission_rate: Number(settingsForm.commission_rate),
      avg_ticket: Number(settingsForm.avg_ticket),
      membership_price: Number(settingsForm.membership_price),
      ...(settingsForm.admin_token.length >= 8 ? { admin_token: settingsForm.admin_token } : {}),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    void load();
  };

  // =========================== LOGIN ======================================
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-lg p-8 space-y-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-gold-500" />
            <h1 className="font-serif text-xl text-white">{t.title}</h1>
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">{t.tokenPrompt}</label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500"
              autoFocus
            />
            <p className="text-xs text-white/40 mt-2">{t.tokenHint}</p>
          </div>
          {authError && <p className="text-sm text-red-400">{t.wrongToken}</p>}
          <button type="submit" className="w-full btn-primary rounded-sm">{t.enter}</button>
          <a href="/" className="block text-center text-xs text-white/50 hover:text-gold-400 transition-colors">{t.backToSite}</a>
        </form>
      </div>
    );
  }

  // =========================== PANEL ======================================
  const statCards = [
    { label: t.totalLeads, value: stats?.totals.leads ?? 0, icon: Mail },
    { label: t.newLeads, value: stats?.byStatus.new?.count ?? 0, icon: Clock },
    { label: t.signedJobs, value: stats?.byStatus.signed?.count ?? 0, icon: CheckCircle },
    { label: t.projectedCommissions, value: fmtUSD.format(stats?.totals.commissionsTotal ?? 0), icon: CreditCard },
    { label: t.activeContractors, value: stats?.totals.activeContractors ?? 0, icon: Users },
    { label: t.verifiedContractors, value: stats?.totals.verifiedContractors ?? 0, icon: ShieldCheck },
    { label: 'MRR (memberships)', value: fmtUSD.format(stats?.totals.mrr ?? 0), icon: CreditCard },
    { label: 'Active memberships', value: stats?.totals.activeMemberships ?? 0, icon: Users },
    { label: 'Free leads left', value: stats?.totals.freeLeadsRemaining ?? 0, icon: Clock },
  ];

  const leadStatusList = ['new', 'contacted', 'quoted', 'signed', 'lost'] as const;

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Barra superior */}
      <header className="sticky top-0 z-10 bg-wine-800/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <h1 className="font-serif text-lg text-gold-400 mr-auto">{t.title}</h1>
          <nav className="flex gap-1 flex-wrap">
            {(Object.keys(t.tabs) as Tab[]).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider transition-colors ${
                  tab === k ? 'bg-gold-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {t.tabs[k]}
              </button>
            ))}
          </nav>
          <a href="/" className="flex items-center gap-1 text-xs text-white/50 hover:text-gold-400">
            <Home className="w-3.5 h-3.5" /> {t.backToSite}
          </a>
          <button
            onClick={() => { setAdminToken(''); setAuthed(false); }}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-red-400"
          >
            <LogOut className="w-3.5 h-3.5" /> {t.logout}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && <p className="text-white/40 text-sm mb-4">…</p>}

        {/* ======================= RESUMEN ======================= */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((card) => (
                <div key={card.label} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <card.icon className="w-5 h-5 text-gold-500 mb-2" />
                  <p className="font-serif text-2xl text-white tabular-nums">{card.value}</p>
                  <p className="text-xs text-white/50 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="font-serif text-lg text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gold-500" /> {t.byStatus}
              </h2>
              <div className="space-y-3">
                {leadStatusList.map((s) => {
                  const count = stats?.byStatus[s]?.count ?? 0;
                  const total = Math.max(1, stats?.totals.leads ?? 1);
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-white/60">{t.status[s]}</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, (count / total) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/80 tabular-nums w-10 text-right">{count}</span>
                      <span className="text-xs text-gold-400 tabular-nums w-20 text-right">
                        {fmtUSD.format(stats?.byStatus[s]?.commission ?? 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================= LEADS ======================= */}
        {tab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={leadFilter}
                onChange={(e) => setLeadFilter(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/20 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500"
              >
                <option value="" className="bg-wine-800">All</option>
                {leadStatusList.map((s) => (
                  <option key={s} value={s} className="bg-wine-800">{t.status[s]}</option>
                ))}
              </select>
              {collectMsg && <span className="text-xs text-gold-400">{collectMsg}</span>}
            </div>

            {leads.length === 0 ? (
              <p className="text-white/50 text-sm bg-white/5 border border-white/10 rounded-lg p-6">{t.leadsTable.noLeads}</p>
            ) : (
              <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-lg">
                <table className="w-full text-sm min-w-[900px]">
                  <thead>
                    <tr className="text-left text-xs text-white/50 uppercase tracking-wider border-b border-white/10">
                      <th className="px-4 py-3">{t.leadsTable.id}</th>
                      <th className="px-4 py-3">{t.leadsTable.name}</th>
                      <th className="px-4 py-3">{t.leadsTable.contact}</th>
                      <th className="px-4 py-3">{t.leadsTable.type}</th>
                      <th className="px-4 py-3">{t.leadsTable.location}</th>
                      <th className="px-4 py-3">{t.leadsTable.status}</th>
                      <th className="px-4 py-3">{t.leadsTable.jobValue}</th>
                      <th className="px-4 py-3">{t.leadsTable.commission}</th>
                      <th className="px-4 py-3">{t.leadsTable.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads
                      .filter((l) => !leadFilter || l.status === leadFilter)
                      .map((lead) => (
                        <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                          <td className="px-4 py-3 text-white/40">{lead.id}</td>
                          <td className="px-4 py-3 text-white/90">{lead.name}</td>
                          <td className="px-4 py-3 text-white/60 text-xs">
                            {lead.phone}<br />{lead.email}
                          </td>
                          <td className="px-4 py-3 text-white/70">{lead.project_type}</td>
                          <td className="px-4 py-3 text-white/60 text-xs">
                            {lead.city && `${lead.city}, `}{lead.state}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className={`px-2 py-1 rounded-sm text-xs border bg-wine-800 focus:outline-none ${STATUS_COLORS[lead.status] ?? ''}`}
                            >
                              {leadStatusList.map((s) => (
                                <option key={s} value={s}>{t.status[s]}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min={0}
                              value={lead.job_value || ''}
                              onChange={(e) => updateLeadValue(lead.id, Number(e.target.value))}
                              placeholder="0"
                              className="w-24 px-2 py-1 bg-white/5 border border-white/20 rounded-sm text-white text-xs tabular-nums focus:outline-none focus:border-gold-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-gold-400 tabular-nums">
                            {lead.commission ? fmtUSD.format(lead.commission) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            {lead.status === 'signed' && lead.commission > 0 && (
                              <button
                                onClick={() => collectCommission(lead.id)}
                                disabled={collectingId === lead.id}
                                className="flex items-center gap-1 px-3 py-1 bg-gold-500 text-white text-xs rounded-sm hover:opacity-90 disabled:opacity-50"
                              >
                                {collectingId === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                                {fmtUSD.format(lead.commission)}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================= CONTRATISTAS ======================= */}
        {tab === 'contractors' && (
          <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-lg">
            {membershipMsg && <p className="text-sm text-green-400 px-4 pt-4">{membershipMsg}</p>}
            {contractors.length === 0 ? (
              <p className="text-white/50 text-sm p-6">{t.contractorsTable.noContractors}</p>
            ) : (
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-xs text-white/50 uppercase tracking-wider border-b border-white/10">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">{t.leadsTable.name}</th>
                    <th className="px-4 py-3">{t.leadsTable.contact}</th>
                    <th className="px-4 py-3">{t.leadsTable.type}</th>
                    <th className="px-4 py-3">{t.leadsTable.location}</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Membership</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contractors.map((c) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                      <td className="px-4 py-3 text-white/40">{c.id}</td>
                      <td className="px-4 py-3 text-white/90">
                        {c.name}
                        {c.company && <span className="block text-xs text-white/50">{c.company}</span>}
                        {c.verified === 1 && <ShieldCheck className="w-3.5 h-3.5 text-green-500 inline ml-1" />}
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">
                        {c.phone && <>{c.phone}<br /></>}{c.email}
                      </td>
                      <td className="px-4 py-3 text-white/70">{c.trade}</td>
                      <td className="px-4 py-3 text-white/60">{c.state}</td>
                      <td className="px-4 py-3">
                        <select
                          value={c.status}
                          onChange={(e) => updateContractor(c.id, { status: e.target.value })}
                          className="px-2 py-1 rounded-sm text-xs border bg-wine-800 focus:outline-none border-white/20 text-white/80"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {(() => {
                          const exp = c.membership_expires_at ? new Date(c.membership_expires_at) : null;
                          const mActive = c.membership_status === 'active' && exp !== null && exp.getTime() > Date.now();
                          return (
                            <div className="space-y-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm ${mActive ? 'bg-green-500/10 text-green-400' : c.free_lead_used ? 'bg-red-500/10 text-red-400' : 'bg-gold-500/10 text-gold-400'}`}>
                                {mActive
                                  ? <>Active · {exp!.toLocaleDateString()}</>
                                  : c.free_lead_used ? 'No membership' : 'Free lead left'}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={async () => {
                                    const updated = await adminApi.grantMembership(c.id, 30);
                                    setMembershipMsg(`✓ ${updated.name}: membresía activa hasta ${(updated.membership_expires_at ?? '').slice(0, 10)}`);
                                    setTimeout(() => setMembershipMsg(''), 5000);
                                    await load();
                                  }}
                                  className="px-2 py-0.5 rounded-sm border border-green-500/40 text-green-400 hover:bg-green-500/10"
                                  title="Activate/extend 30 days (e.g. cash payment)"
                                >
                                  +30d
                                </button>
                                <button
                                  onClick={async () => {
                                    const r = await adminApi.membershipCheckout(c.id);
                                    if (r.url) {
                                      window.open(r.url, '_blank');
                                      setMembershipMsg('✓ Enlace de pago de Stripe generado (se abrió en otra pestaña)');
                                    } else if (r.membership) {
                                      setMembershipMsg(`✓ ${r.membership.name}: membresía activa hasta ${(r.membership.membership_expires_at ?? '').slice(0, 10)} (modo demo — sin Stripe)`);
                                    } else {
                                      setMembershipMsg('✓ Listo');
                                    }
                                    setTimeout(() => setMembershipMsg(''), 6000);
                                    await load();
                                  }}
                                  className="px-2 py-0.5 rounded-sm border border-gold-500/40 text-gold-400 hover:bg-gold-500/10"
                                  title="Send Stripe payment link (or demo-activate if Stripe not configured)"
                                >
                                  $150
                                </button>
                                {(c.membership_status === 'active') && (
                                  <button
                                    onClick={async () => {
                                      await adminApi.updateContractor(c.id, { membership_reset: true });
                                      setMembershipMsg(`✓ Membresía de ${c.name} reiniciada (sin membresía activa)`);
                                      setTimeout(() => setMembershipMsg(''), 5000);
                                      await load();
                                    }}
                                    className="px-2 py-0.5 rounded-sm border border-red-500/40 text-red-400 hover:bg-red-500/10"
                                    title="Reset membership dates (fix over-extended dates)"
                                  >
                                    ↺
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => updateContractor(c.id, { verified: c.verified !== 1 })}
                          className="px-2 py-1 text-xs rounded-sm border border-gold-500/40 text-gold-400 hover:bg-gold-500/10"
                        >
                          {c.verified === 1 ? t.contractorsTable.unverify : t.contractorsTable.verify}
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          defaultValue={c.rating ?? 0}
                          title="Rating 0–5"
                          onBlur={(e) => {
                            const v = Number(e.target.value) || 0;
                            if (v !== c.rating) void updateContractor(c.id, { rating: v });
                          }}
                          className="w-16 px-2 py-1 rounded-sm text-xs border bg-wine-800 border-white/20 text-white/80 focus:outline-none focus:border-gold-500"
                        />
                        <input
                          type="number"
                          min={0}
                          defaultValue={c.jobs_done ?? 0}
                          title="Jobs completed"
                          onBlur={(e) => {
                            const v = Number(e.target.value) || 0;
                            if (v !== c.jobs_done) void updateContractor(c.id, { jobs_done: v });
                          }}
                          className="w-20 px-2 py-1 rounded-sm text-xs border bg-wine-800 border-white/20 text-white/80 focus:outline-none focus:border-gold-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ======================= OUTBOX ======================= */}
        {tab === 'outbox' && (
          <div className="space-y-3">
            {outbox.length === 0 ? (
              <p className="text-white/50 text-sm bg-white/5 border border-white/10 rounded-lg p-6">{t.outboxEmpty}</p>
            ) : (
              outbox.map((m) => (
                <details key={m.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 group">
                  <summary className="cursor-pointer flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="text-white/60 text-xs">{m.created_at}</span>
                    <span className="text-white/90">{m.to_email}</span>
                    <span className="text-white/50 truncate mr-auto">{m.subject}</span>
                    {m.sent === 1
                      ? <span className="text-xs text-green-400">✓ Sent</span>
                      : <span className="text-xs text-amber-400">Queued</span>}
                  </summary>
                  <pre className="mt-3 text-xs text-white/60 whitespace-pre-wrap bg-black/30 rounded p-3">{m.body}</pre>
                </details>
              ))
            )}
          </div>
        )}

        {/* ======================= AJUSTES ======================= */}
        {tab === 'settings' && settingsInfo && (
          <form onSubmit={saveSettings} className="max-w-lg space-y-5 bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gold-500" />
              <span className={settingsInfo.resend ? 'text-green-400' : 'text-white/50'}>
                {settingsInfo.resend ? t.settings.resendOn : t.settings.resendOff}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-gold-500" />
              <span className={settingsInfo.stripe ? 'text-green-400' : 'text-white/50'}>
                {settingsInfo.stripe ? t.settings.stripeOn : t.settings.stripeOff}
              </span>
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">{t.settings.commissionRate}</label>
              <input
                type="number" step="0.5" min="0" max="30"
                value={settingsForm.commission_rate}
                onChange={(e) => setSettingsForm((p) => ({ ...p, commission_rate: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">{t.settings.avgTicket}</label>
              <input
                type="number" step="100" min="0"
                value={settingsForm.avg_ticket}
                onChange={(e) => setSettingsForm((p) => ({ ...p, avg_ticket: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">Membership price (USD/month)</label>
              <input
                type="number" step="5" min="0" max="500"
                value={settingsForm.membership_price}
                onChange={(e) => setSettingsForm((p) => ({ ...p, membership_price: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-2">{t.settings.adminToken}</label>
              <input
                type="password"
                value={settingsForm.admin_token}
                onChange={(e) => setSettingsForm((p) => ({ ...p, admin_token: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500"
              />
            </div>
            <button type="submit" className="btn-primary rounded-sm">{settingsSaved ? t.settings.saved : t.settings.save}</button>
            <p className="text-xs text-white/40 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Variables de entorno: ADMIN_TOKEN, RESEND_API_KEY, STRIPE_SECRET_KEY, OWNER_EMAIL
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
