import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import logo from '../assets/logo.png';
import logoWhite from '../assets/logo_white.png';
import { 


  IconCalendar, 
  IconClock, 
  IconCheck, 
  IconShield, 
  IconMapPin, 
  IconSearch, 
  IconAlert, 
  IconPixSymbol, 
  IconUsers,
  IconWallet,
  IconUser,
  IconStar
} from './Icons';

const getApiOrigin = () => {
  if (typeof window === 'undefined') return '';
  const { protocol, hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:3001`;
  }
  return window.location.origin;
};
const apiOrigin = getApiOrigin();

const GoogleAdSlot = ({ slotId = 'default-slot', height = '90px' }) => {
  return (
    <div style={{
      margin: '16px auto',
      padding: '8px',
      backgroundColor: '#f8fafc',
      border: '1px dashed #cbd5e1',
      borderRadius: '4px',
      textAlign: 'center',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <span style={{ fontSize: '0.55rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
        Espaço Publicitário GIG BR
      </span>
      <ins className="adsbygoogle"
           style={{ display: 'block', height, width: '100%' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot={slotId}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

// Complete list of all 27 Brazilian states
const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

// Interactive 3D Flip Card Component for Individual Freelancers
const TalentCard = ({ contractor, t, onPreHire, onPropose }) => {
  const [flipped, setFlipped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareLink = (e) => {
    e.stopPropagation();
    const link = `${window.location.origin}?talent=${contractor.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      className={`flip-card ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">
        
        {/* Front of Card */}
        <div className="flip-card-front">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
            <img 
              src={contractor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'} 
              alt={contractor.name} 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-green)' }}
            />
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{contractor.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{contractor.role}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', width: '100%', textAlign: 'left', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Registro:</span>
              <span style={{ fontWeight: 700 }}>
                {contractor.cnpj ? `MEI: ${contractor.cnpj}` : `PF (Autônomo)`}
              </span>
            </div>
            {contractor.cpf && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CPF:</span>
                <span style={{ fontFamily: 'monospace' }}>{contractor.cpf}</span>
              </div>
            )}
            {contractor.omb && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>OMB (Músico):</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>{contractor.omb}</span>
              </div>
            )}
            {contractor.drt && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>DRT (Credencial):</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>{contractor.drt}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Localização:</span>
              <span style={{ fontWeight: 600 }}>{contractor.city}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Classificação:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                ⭐ {contractor.rating} ({contractor.completedShifts} Gigs)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', width: '100%', marginTop: '10px' }}>
            <span className="badge badge-green">
              <IconShield style={{ width: '12px', height: '12px' }} /> {t.vettedLabel}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>🔄 Clique p/ Bio</span>
          </div>
        </div>

        {/* Back of Card (Bio - Max 250 chars) */}
        <div className="flip-card-back">
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', color: 'var(--text-main)' }}>
              Resumo Profissional
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontStyle: 'italic' }}>
              "{contractor.bio ? contractor.bio.substring(0, 250) : 'Nenhuma biografia disponível para este prestador.'}"
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Avoid flipback
                  onPreHire(contractor);
                }}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, padding: '6px 6px', fontSize: '0.65rem' }}
                title="Reserva garantida com depósito de 50% de sinal"
              >
                🤝 Contratar (Sinal)
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Avoid flipback
                  onPropose(contractor);
                }}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, padding: '6px 6px', fontSize: '0.65rem', backgroundColor: '#e2e8f0', color: '#1f2937', border: '1px solid #cbd5e1' }}
                title="Enviar proposta por e-mail"
              >
                📧 Proposta Direta
              </button>
            </div>
            
            <button 
              onClick={handleShareLink}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', padding: '6px 12px', fontSize: '0.7rem' }}
            >
              {copiedLink ? '✅ Copiado' : '🔗 Compartilhar'}
            </button>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>🔄 Clique para voltar</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// Interactive 3D Flip Card Component for Employers / Contractors
const EmployerCard = ({ employer, t }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className={`flip-card ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">

        {/* Front of Card */}
        <div className="flip-card-front">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-blue-light)', 
              color: 'var(--color-blue)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.1rem',
              fontWeight: 800
            }}>
              🏢
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{employer.companyName}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Produtor: {employer.name}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', width: '100%', textAlign: 'left', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CNPJ Produtora:</span>
              <span style={{ fontFamily: 'monospace' }}>{employer.cnpj}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Localização:</span>
              <span style={{ fontWeight: 600 }}>{employer.city}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Regime Fiscal:</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: employer.hiringMode === 'NF' ? 'var(--color-blue)' : 'var(--color-green)' 
                }}>
                  {employer.hiringMode === 'NF' ? 'Exige Nota Fiscal' : 'Contratação Direta / CPF'}
                </span>
              </div>
              {employer.hiringMode === 'NF' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Regra da Nota:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {employer.thirdPartyInvoice === 'THIRD_PARTY_OK' ? 'Aceita nota de terceiros' : 'Apenas nota própria'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', width: '100%', marginTop: '10px' }}>
            <span className="badge badge-blue">Produtora Contratante</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>🔄 Clique p/ Bio</span>
          </div>
        </div>

        {/* Back of Card (Employer Bio - Max 250 chars) */}
        <div className="flip-card-back">
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', color: 'var(--text-main)' }}>
              Sobre a Produtora
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontStyle: 'italic' }}>
              "{employer.bio ? employer.bio.substring(0, 250) : 'Nenhuma descrição fornecida por esta produtora.'}"
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Avoid flipback
                alert(`Enviando proposta de show / portfólio para ${employer.companyName}.`);
              }}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', padding: '6px 12px' }}
            >
              Enviar Portfólio
            </button>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>🔄 Clique para voltar</span>
          </div>
        </div>

      </div>
    </div>
  );
};

const DesktopDashboard = ({ showSimulator, toggleSimulator }) => {
  const {
    t,
    language,
    toggleLanguage,
    events,
    contractors,
    shifts,
    activeEventId,
    setActiveEventId,
    notifications,
    gpsStatus,
    userLocation,
    requestGeolocation,
    mockLocation,
    proximityFilterEnabled,
    setProximityFilterEnabled,
    adjustAndApproveHours,
    openPixPayment,
    jobOpportunities,
    employers,
    groups,
    registerFreelancer,
    registerEmployer,
    postJobOpportunity,
    createGroup,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshAllData,
    currentUser,
    setCurrentUser,
    userRole,
    setUserRole,
    deleteUserAdmin,
    deleteGroupAdmin,
    updateContractor,
    updateEmployer
  } = useContext(AppContext);

  // Layout Tab State: 'talentos', 'vagas', 'cadastro', 'financeiro', 'admin', 'freelancer_dash'
  const [dashboardTab, setDashboardTab] = useState('talentos');

  // Automatically default to Talent Directory (talentos) upon login as requested
  
  // Talent Sub-Tab: 'individuais', 'equipes', or 'contratantes'
  const [talentSubTab, setTalentSubTab] = useState('individuais');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Hours adjustment state
  const [adjustingShiftId, setAdjustingShiftId] = useState(null);
  const [adjustedHours, setAdjustedHours] = useState('');

  // Freelancer Registration State (with PF/PJ toggle, OMB/DRT, Bio, Email, Phone, and State list)
  const [freelancerForm, setFreelancerForm] = useState({
    registrationType: 'PJ', // 'PJ' or 'PF'
    name: '',
    role: '',
    category: 'Músicos',
    cnpj: '',
    cpf: '',
    pixKey: '',
    pixType: 'CNPJ',
    city: 'São Paulo',
    state: 'SP',
    omb: '',
    drt: '',
    bio: '',
    email: '',
    phone: '',
    avatar: ''
  });
  const [freelancerSuccess, setFreelancerSuccess] = useState(false);

  // Employer Registration State (with NF/Direct hiring mode, bio, third party rule, city & state list)
  const [employerForm, setEmployerForm] = useState({
    name: '',
    companyName: '',
    cnpj: '',
    city: 'São Paulo',
    state: 'SP',
    phone: '',
    hiringMode: 'NF', // 'NF' (Exige Nota Fiscal) or 'DIRETA' (Contratação Direta)
    thirdPartyInvoice: 'OWN_ONLY', // 'OWN_ONLY' or 'THIRD_PARTY_OK'
    bio: ''
  });
  const [employerSuccess, setEmployerSuccess] = useState(false);
  const [hiringContractor, setHiringContractor] = useState(null);
  const [proposingContractor, setProposingContractor] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [depositPIXCopied, setDepositPIXCopied] = useState(false);

  // Guest Registration States
  const [showGuestRegisterModal, setShowGuestRegisterModal] = useState(false);
  const [guestTargetJob, setGuestTargetJob] = useState(null);
  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    registrationType: 'PF',
    omb: '',
    drt: '',
    bio: '',
    avatar: ''
  });
  const [guestError, setGuestError] = useState('');

  // Job Opportunity Post State
  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'Músicos',
    payment: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    location: 'São Paulo - SP'
  });
  const [jobSuccess, setJobSuccess] = useState(false);

  // Group Formation State
  const [groupForm, setGroupForm] = useState({
    name: '',
    category: 'Músicos',
    description: '',
    city: 'São Paulo',
    state: 'SP',
    selectedMembers: [],
    email: '',
    avatar: ''
  });
  const [groupSuccess, setGroupSuccess] = useState(false);

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: 'São Paulo - SP',
    budgetLimit: '',
    description: '',
    pixKey: '',
    crowdfundGoal: ''
  });
  const [eventSuccess, setEventSuccess] = useState(false);

  // Event Edit & Crowdfunding States
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventForm, setEditEventForm] = useState({
    name: '',
    date: '',
    location: '',
    budgetLimit: 0,
    crowdfundGoal: 0,
    pixKey: ''
  });
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [crowdfundAmount, setCrowdfundAmount] = useState('');
  const [crowdfundSuccess, setCrowdfundSuccess] = useState(false);

  React.useEffect(() => {
    if (currentUser && currentUser.pixKey) {
      setEventForm(prev => ({
        ...prev,
        pixKey: currentUser.pixKey
      }));
    }
  }, [currentUser]);

  // Event Crew / Human Costs Allocation Form State
  const [crewForm, setCrewForm] = useState({
    contractorId: '',
    scheduledHours: 8,
    hourlyRate: 35
  });
  const [crewSuccess, setCrewSuccess] = useState(false);

  // Handle shift hours adjustments save
  const handleAdjustSave = (shiftId) => {
    if (adjustedHours === '') return;
    adjustAndApproveHours(shiftId, adjustedHours);
    setAdjustingShiftId(null);
    setAdjustedHours('');
  };

  const handleAdjustStart = (shift) => {
    setAdjustingShiftId(shift.id);
    setAdjustedHours(shift.actualHours || shift.scheduledHours || '8');
  };

  const handleApplyOpportunity = (job) => {
    if (userRole === 'guest') {
      setGuestTargetJob(job);
      setGuestError('');
      setGuestForm({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        registrationType: 'PF',
        omb: '',
        drt: '',
        bio: '',
        avatar: ''
      });
      setShowGuestRegisterModal(true);
    } else {
      // Simulate real/mock email to target job author
      const emailTo = job.email || 'roberto@globo.com.br';
      const emailSubject = `Candidatura Registrada - Vaga: ${job.title}`;
      const emailBody = `
Olá, o profissional ${currentUser.name} (${currentUser.email}) se candidatou para a sua vaga "${job.title}".
Cachê previsto: ${job.payment}
Data prevista: ${job.date}
Contato do profissional: ${currentUser.phone || 'Não informado'}
`;

      const apiOrigin = window.location.hostname === 'localhost' ? `${apiOrigin}` : window.location.origin;
      fetch(`${apiOrigin}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: currentUser.email,
          recipient: emailTo,
          subject: emailSubject,
          body: emailBody
        })
      }).catch(err => console.warn("Email dispatcher API offline."));

      alert(`✅ Candidatura enviada com sucesso!\nUma notificação contendo seu perfil foi encaminhada para a caixa postal:\n📧 ${emailTo}\n\nO registro foi salvo em emails_sent.log.`);
    }
  };

  const handleGuestRegisterSubmit = async (e) => {
    e.preventDefault();
    setGuestError('');

    if (!guestForm.name || !guestForm.email || !guestForm.phone || !guestForm.cpf) {
      setGuestError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      id: `cont-${Date.now()}`,
      name: guestForm.name,
      email: guestForm.email,
      phone: guestForm.phone,
      role: 'freelancer',
      cpf: guestForm.cpf,
      cnpj: guestForm.registrationType === 'PJ' ? guestForm.cpf : '',
      registration_type: guestForm.registrationType,
      omb: guestForm.omb || '',
      drt: guestForm.drt || '',
      bio: guestForm.bio || 'Profissional homologado convidado via GIG BR.',
      avatar: guestForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      city: 'São Paulo',
      state: 'SP',
      is_vetted: 1,
      rating: 5.0,
      completed_shifts: 0
    };

    const apiOrigin = window.location.hostname === 'localhost' ? `${apiOrigin}` : window.location.origin;
    try {
      const res = await fetch(`${apiOrigin}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao registrar usuário convidado.');
      }

      const newUser = await res.json();
      
      // Auto register/apply for target job
      if (guestTargetJob) {
        const emailTo = guestTargetJob.email || 'roberto@globo.com.br';
        const emailSubject = `Candidatura Convidado Homologado - Vaga: ${guestTargetJob.title}`;
        const emailBody = `
Olá, o profissional ${newUser.name} (${newUser.email}) acabou de se cadastrar e se candidatar para a sua vaga "${guestTargetJob.title}".
Cachê previsto: ${guestTargetJob.payment}
Data prevista: ${guestTargetJob.date}
Contato do profissional: ${newUser.phone || 'Não informado'}
`;
        await fetch(`${apiOrigin}/api/emails/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: newUser.email,
            recipient: emailTo,
            subject: emailSubject,
            body: emailBody
          })
        }).catch(err => console.warn("Email dispatcher API offline."));
      }

      // Upgrade to active freelancer state in context
      registerFreelancer(payload);
      setCurrentUser(payload);
      setUserRole('freelancer');

      alert(`🎉 Cadastro e candidatura concluídos com sucesso!\nSeu cadastro permanente foi criado com o e-mail: ${payload.email}.\n\nSeja bem-vindo(a) ao GIG BR!`);

      setShowGuestRegisterModal(false);
      setGuestTargetJob(null);
    } catch (err) {
      setGuestError(err.message);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== 'employer' || !currentUser.cnpj) {
      alert("Erro de Segurança: Um evento só poderá ser criado por um produtor com CNPJ!");
      return;
    }
    if (!eventForm.name || !eventForm.budgetLimit) return;

    if (!eventForm.description || eventForm.description.trim().length < 15) {
      alert("Por favor, preencha a descrição detalhada do evento (mínimo de 15 caracteres)!");
      return;
    }

    try {
      const stateCode = eventForm.location.includes('RJ') ? 'RJ' : (eventForm.location.includes('MG') ? 'MG' : 'SP');
      await createEvent({
        ...eventForm,
        state: stateCode,
        employer_id: currentUser.id
      });
      setEventSuccess(true);
      setEventForm({
        name: '',
        date: new Date().toISOString().split('T')[0],
        location: 'São Paulo - SP',
        budgetLimit: '',
        description: '',
        pixKey: currentUser?.pixKey || '',
        crowdfundGoal: ''
      });
      setTimeout(() => setEventSuccess(false), 4000);
    } catch (err) {
      alert("Erro ao criar evento: " + err.message);
    }
  };

  const handleCrewSubmit = async (e) => {
    e.preventDefault();
    if (!activeEventId) {
      alert("Por favor, selecione um evento ativo antes!");
      return;
    }
    if (!crewForm.contractorId) {
      alert("Selecione um profissional cadastrado!");
      return;
    }

    try {
      await assignShiftToEvent({
        eventId: activeEventId,
        contractorId: crewForm.contractorId,
        scheduledHours: crewForm.scheduledHours,
        hourlyRate: crewForm.hourlyRate
      });
      setCrewSuccess(true);
      setCrewForm({
        contractorId: '',
        scheduledHours: 8,
        hourlyRate: 35
      });
      setTimeout(() => setCrewSuccess(false), 4000);
    } catch (err) {
      alert("Erro ao alocar profissional: " + err.message);
    }
  };

  const handleEventEditStart = (evt) => {
    setEditingEventId(evt.id);
    setEditEventForm({
      name: evt.name,
      date: evt.date,
      location: evt.location,
      budgetLimit: evt.budgetLimit || evt.budget_limit || 0,
      crowdfundGoal: evt.crowdfundGoal || evt.crowdfund_goal || 0,
      pixKey: evt.pixKey || evt.pix_key || ''
    });
    setShowEditEventModal(true);
  };

  const handleEventEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEventId) return;

    try {
      await updateEvent(editingEventId, editEventForm);
      setShowEditEventModal(false);
      setEditingEventId(null);
      alert("Show/Evento atualizado com sucesso!");
    } catch (err) {
      alert("Erro ao editar evento: " + err.message);
    }
  };

  const handleEventDelete = async (eventId) => {
    if (!window.confirm("⚠️ Deseja realmente excluir este show/evento? Esta ação é irreversível e excluirá todo o histórico associado.")) {
      return;
    }

    try {
      await deleteEvent(eventId);
      const remainingEvents = events.filter(e => e.id !== eventId);
      if (remainingEvents.length > 0) {
        setActiveEventId(remainingEvents[0].id);
      } else {
        setActiveEventId('');
      }
      alert("Show/Evento excluído com sucesso!");
    } catch (err) {
      alert("Erro ao excluir evento: " + err.message);
    }
  };

  const handleCrowdfundContribution = async (e) => {
    e.preventDefault();
    if (!activeEventId || !activeEvent) return;
    const amount = parseFloat(crowdfundAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, digite um valor válido de apoio.");
      return;
    }

    try {
      const currentRaised = activeEvent.crowdfundRaised || 0;
      const newRaised = currentRaised + amount;
      await updateEvent(activeEventId, {
        ...activeEvent,
        crowdfundRaised: newRaised
      });

      const contributor = currentUser?.name || 'Apoiador Anônimo';
      addNotification('web', `Apoio de R$ ${amount.toFixed(2)} recebido via PIX por ${contributor}.`, 'all', activeEventId);
      
      setCrowdfundAmount('');
      setCrowdfundSuccess(true);
      setTimeout(() => setCrowdfundSuccess(false), 3000);
      alert(`🎉 Obrigado pelo apoio de R$ ${amount.toFixed(2)} via PIX!`);
    } catch (err) {
      alert("Erro ao processar contribuição: " + err.message);
    }
  };

  // Onboarding submissions
  const handleFreelancerSubmit = (e) => {
    e.preventDefault();
    if (!freelancerForm.name || !freelancerForm.role) return;
    
    // Resolve location formatting
    const locationStr = `${freelancerForm.city} - ${freelancerForm.state}`;
    registerFreelancer({
      ...freelancerForm,
      city: locationStr
    });

    setFreelancerForm({
      registrationType: 'PJ',
      name: '',
      role: '',
      category: 'Músicos',
      cnpj: '',
      cpf: '',
      pixKey: '',
      pixType: 'CNPJ',
      city: 'São Paulo',
      state: 'SP',
      omb: '',
      drt: '',
      bio: '',
      email: '',
      phone: '',
      avatar: ''
    });
    setFreelancerSuccess(true);
    setTimeout(() => setFreelancerSuccess(false), 3000);
  };

  const handleEmployerSubmit = (e) => {
    e.preventDefault();
    if (!employerForm.companyName || !employerForm.name) return;
    
    const locationStr = `${employerForm.city} - ${employerForm.state}`;
    registerEmployer({
      ...employerForm,
      city: locationStr
    });

    setEmployerForm({
      name: '',
      companyName: '',
      cnpj: '',
      city: 'São Paulo',
      state: 'SP',
      phone: '',
      hiringMode: 'NF',
      thirdPartyInvoice: 'OWN_ONLY',
      bio: ''
    });
    setEmployerSuccess(true);
    setTimeout(() => setEmployerSuccess(false), 3000);
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.payment || parseFloat(jobForm.payment) <= 0) {
      alert("O cachê líquido obrigatório deve ser informado e maior que zero!");
      return;
    }
    postJobOpportunity(jobForm);
    setJobForm({
      title: '',
      category: 'Músicos',
      payment: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      location: 'São Paulo - SP'
    });
    setJobSuccess(true);
    setTimeout(() => setJobSuccess(false), 3000);
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    if (!groupForm.name || !groupForm.description || !groupForm.email) {
      alert("Por favor, preencha o nome, e-mail de contato e descrição do grupo!");
      return;
    }
    
    const locationStr = `${groupForm.city} - ${groupForm.state}`;
    createGroup({
      name: groupForm.name,
      category: groupForm.category,
      description: groupForm.description,
      city: locationStr,
      members: groupForm.selectedMembers,
      email: groupForm.email,
      avatar: groupForm.avatar
    });

    setGroupForm({
      name: '',
      category: 'Músicos',
      description: '',
      city: 'São Paulo',
      state: 'SP',
      selectedMembers: [],
      email: '',
      avatar: ''
    });
    setGroupSuccess(true);
    setTimeout(() => setGroupSuccess(false), 3000);
  };

  const handleMemberToggle = (memberId) => {
    setGroupForm(prev => {
      const alreadySelected = prev.selectedMembers.includes(memberId);
      const updated = alreadySelected
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId];
      return { ...prev, selectedMembers: updated };
    });
  };

  // Filters calculations for available Talent
  const filteredContractors = contractors.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.cnpj || '').includes(searchTerm) ||
      (c.omb || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.drt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesRegion = !proximityFilterEnabled || c.state === userLocation.region;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  // Filter employers
  const filteredEmployers = employers.filter(emp => {
    const matchesSearch = 
      (emp.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !proximityFilterEnabled || emp.state === userLocation.region;
    return matchesSearch && matchesRegion;
  });

  // Filter groups
  const filteredGroups = groups.filter(g => {
    const matchesSearch = (g.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || g.category === categoryFilter;
    const matchesRegion = !proximityFilterEnabled || g.state === userLocation.region;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  // Filters calculations for job opportunities
  const filteredJobs = jobOpportunities.filter(job => {
    const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter;
    const matchesRegion = !proximityFilterEnabled || job.location.includes(userLocation.region);
    return matchesCategory && matchesRegion;
  });

  // Original events filtering for dashboard
  const filteredEvents = proximityFilterEnabled 
    ? events.filter(e => e.state === userLocation.region)
    : events;

  const activeEvent = events.find(e => e.id === activeEventId) || events[0];
  const eventShifts = shifts.filter(s => s.eventId === activeEvent?.id);
  const percentSpent = activeEvent ? (activeEvent.currentSpend / activeEvent.budgetLimit) * 100 : 0;
  const isBudgetWarning = percentSpent > 85;

  const renderProfileForm = () => {
    return (
      <form onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.elements.profileName.value;
        const email = form.elements.profileEmail.value;
        const phone = form.elements.profilePhone.value;
        const registrationType = form.elements.profileRegType.value;
        const cpf = registrationType === 'PF' ? form.elements.profileCpf.value : '';
        const cnpj = registrationType === 'PJ' ? form.elements.profileCnpj.value : '';
        const pixType = form.elements.profilePixType.value;
        const pixKey = form.elements.profilePixKey.value;
        const city = form.elements.profileCity.value;
        const state = form.elements.profileState.value;
        const bio = form.elements.profileBio.value;
        const password = form.elements.profilePassword.value;
        const marketplaceUrl = form.elements.profileMarketplaceUrl ? form.elements.profileMarketplaceUrl.value : '';
        const websiteUrl = form.elements.profileWebsiteUrl ? form.elements.profileWebsiteUrl.value : '';
        
        const updatedData = {
          name,
          email,
          phone,
          password,
          registrationType,
          cpf,
          cnpj,
          pixType,
          pixKey,
          city,
          state,
          bio,
          avatar: currentUser?.avatar || '',
          marketplace_url: marketplaceUrl,
          website_url: websiteUrl
        };

        if (userRole === 'freelancer') {
          updatedData.category = form.elements.profileCategory.value;
          updatedData.omb = form.elements.profileOmb.value;
          updatedData.drt = form.elements.profileDrt.value;
        } else {
          updatedData.companyName = form.elements.profileCompanyName.value;
        }

        try {
          if (userRole === 'freelancer') {
            await updateContractor(currentUser.id, updatedData);
          } else {
            await updateEmployer(currentUser.id, updatedData);
          }
          setCurrentUser(prev => ({ ...prev, ...updatedData }));
          alert("✓ Perfil cadastrado atualizado com sucesso!");
        } catch(err) {
          alert("Erro ao atualizar perfil: " + err.message);
        }
      }} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Nome Completo / Razão Social</label>
            <input 
              type="text" name="profileName" className="form-input" 
              defaultValue={currentUser?.name} required style={{ backgroundColor: '#ffffff' }}
            />
          </div>
          {userRole === 'employer' ? (
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Nome Fantasia / Empresa</label>
              <input 
                type="text" name="profileCompanyName" className="form-input" 
                defaultValue={currentUser?.companyName || currentUser?.name} required style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Categoria Profissional</label>
              <select 
                name="profileCategory" className="form-input" 
                defaultValue={currentUser?.category || 'Músicos'} style={{ backgroundColor: '#ffffff' }}
              >
                <option value="Músicos">Músicos</option>
                <option value="Roadies">Roadies</option>
                <option value="Técnicos">Técnicos</option>
                <option value="Artistas">Artistas</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>E-mail</label>
            <input 
              type="email" name="profileEmail" className="form-input" 
              defaultValue={currentUser?.email} required style={{ backgroundColor: '#ffffff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Telefone</label>
            <input 
              type="text" name="profilePhone" className="form-input" 
              defaultValue={currentUser?.phone} required style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Tipo de Regime</label>
            <select 
              name="profileRegType" className="form-input" 
              defaultValue={currentUser?.registrationType || 'PF'} style={{ backgroundColor: '#ffffff' }}
              onChange={(e) => {
                const val = e.target.value;
                const cpfBlock = document.getElementById('profileCpfBlock');
                const cnpjBlock = document.getElementById('profileCnpjBlock');
                if (cpfBlock && cnpjBlock) {
                  if (val === 'PF') {
                    cpfBlock.style.display = 'block';
                    cnpjBlock.style.display = 'none';
                  } else {
                    cpfBlock.style.display = 'none';
                    cnpjBlock.style.display = 'block';
                  }
                }
              }}
            >
              <option value="PF">👤 Pessoa Física (CPF)</option>
              <option value="PJ">🏢 Pessoa Jurídica (CNPJ)</option>
            </select>
          </div>
          
          <div id="profileCpfBlock" style={{ display: (currentUser?.registrationType || 'PF') === 'PF' ? 'block' : 'none' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>CPF</label>
            <input 
              type="text" name="profileCpf" className="form-input" 
              defaultValue={currentUser?.cpf || ''} placeholder="123.456.789-00" style={{ backgroundColor: '#ffffff' }}
            />
          </div>
          <div id="profileCnpjBlock" style={{ display: (currentUser?.registrationType || 'PF') === 'PJ' ? 'block' : 'none' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>CNPJ</label>
            <input 
              type="text" name="profileCnpj" className="form-input" 
              defaultValue={currentUser?.cnpj || ''} placeholder="00.000.000/0001-00" style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Tipo de Chave PIX</label>
            <select 
              name="profilePixType" className="form-input" 
              defaultValue={currentUser?.pixType || 'CPF'} style={{ backgroundColor: '#ffffff' }}
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
              <option value="Email">E-mail</option>
              <option value="Telefone">Celular</option>
              <option value="Chave Aleatoria">Chave Aleatória</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Chave PIX Ativa</label>
            <input 
              type="text" name="profilePixKey" className="form-input" 
              defaultValue={currentUser?.pixKey} required placeholder="Sua chave PIX" style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        {userRole === 'freelancer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Registro OMB (Opcional)</label>
              <input 
                type="text" name="profileOmb" className="form-input" 
                defaultValue={currentUser?.omb || ''} placeholder="OMB/SP 12345" style={{ backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Registro DRT (Opcional)</label>
              <input 
                type="text" name="profileDrt" className="form-input" 
                defaultValue={currentUser?.drt || ''} placeholder="DRT-XXXX" style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cidade</label>
            <input 
              type="text" name="profileCity" className="form-input" 
              defaultValue={currentUser?.city || 'São Paulo'} required style={{ backgroundColor: '#ffffff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Estado (UF)</label>
            <input 
              type="text" name="profileState" className="form-input" 
              defaultValue={currentUser?.state || 'SP'} required maxLength="2" style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Nova Senha de Acesso (deixe em branco para manter)</label>
          <input 
            type="password" name="profilePassword" className="form-input" 
            placeholder="Digite a nova senha se deseja alterar" style={{ backgroundColor: '#ffffff' }}
          />
        </div>

        {(currentUser?.cnpj || currentUser?.registrationType === 'PJ') && (
          <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: '#0f172a' }}>🌐 Integração de Marketplace & Vendas</h4>
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '10px' }}>Insira a URL do seu catálogo de vendas externo ou marketplace para habilitar vendas em seu perfil.</p>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Link do Marketplace / Catálogo de Produtos</label>
              <input 
                type="url" name="profileMarketplaceUrl" className="form-input" 
                defaultValue={currentUser?.marketplace_url || currentUser?.marketplaceUrl || ''} 
                placeholder="Ex: https://lista.mercadolivre.com.br/_CustId_XXXX ou link da API/Loja" 
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Biografia / Apresentação</label>
          <textarea 
            name="profileBio" className="form-input" rows="4" 
            defaultValue={currentUser?.bio} required style={{ backgroundColor: '#ffffff', resize: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Site / Perfil Social / Link Externo</label>
          <input 
            type="url" name="profileWebsiteUrl" className="form-input" 
            defaultValue={currentUser?.website_url || currentUser?.websiteUrl || ''} 
            placeholder="Ex: https://instagram.com/seu_perfil ou seu site oficial"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Foto de Perfil (Avatar)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={currentUser?.avatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <input 
              type="file" accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    alert("A imagem não pode ultrapassar 2MB!");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (userRole === 'freelancer') {
                      updateContractor(currentUser.id, { avatar: reader.result });
                    } else {
                      updateEmployer(currentUser.id, { avatar: reader.result });
                    }
                    setCurrentUser(prev => ({ ...prev, avatar: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ fontSize: '0.75rem', flex: 1 }}
            />
          </div>
        </div>

        <GoogleAdSlot slotId="profile-settings-ad" height="90px" />

        <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.85rem', width: '100%' }}>
          Salvar Cadastro
        </button>

        <button 
          type="button" 
          onClick={async () => {
            const confirmDelete = window.confirm("⚠️ ATENÇÃO: Tem certeza absoluta que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita!");
            if (confirmDelete) {
              try {
                await deleteUserAdmin(currentUser.id);
                alert("✓ Sua conta foi excluída com sucesso.");
                setCurrentUser(null);
                setUserRole(null);
                setDashboardTab('talentos');
              } catch (err) {
                alert("Erro ao excluir conta: " + err.message);
              }
            }
          }}
          className="btn btn-secondary" 
          style={{ padding: '12px', fontSize: '0.85rem', width: '100%', marginTop: '10px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none' }}
        >
          🗑️ Excluir Minha Conta Permanentemente
        </button>
      </form>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header - ENLARGED central logo, LARGER GIG BR text aligned bottom right */}
      <header style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%', 
        padding: '32px 0 20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        position: 'relative'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%', 
          maxWidth: '320px'
        }}>
          <img src={logoWhite} alt="GIG BR Logo" className="logo-img" style={{ maxHeight: '300px', width: 'auto', display: 'block', objectFit: 'contain' }} />
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginTop: '8px'
          }}>
            <span style={{ 
              fontFamily: 'var(--font-accent)', 
              fontSize: '2.4rem', 
              fontWeight: 900, 
              color: '#ffffff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>
              GIG BR
            </span>
          </div>
        </div>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontSize: '0.75rem', 
          fontFamily: 'var(--font-accent)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.12em',
          marginTop: '24px',
          fontWeight: 700
        }}>
          {t.partnerLabel}
        </p>
      </header>

      {/* Control Navigation & Tab Switchers */}
      <div className="desktop-tab-nav" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#ffffff',
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Tab Buttons (Dynamic based on Role) */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(userRole === 'admin' || userRole === 'employer' || userRole === 'freelancer' || !userRole) && (
            <button 
              onClick={() => setDashboardTab('talentos')}
              className={`btn ${dashboardTab === 'talentos' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              🔍 Buscar Talentos
            </button>
          )}
          {(userRole === 'admin' || userRole === 'employer' || userRole === 'freelancer' || !userRole) && (
            <button 
              onClick={() => setDashboardTab('vagas')}
              className={`btn ${dashboardTab === 'vagas' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              💼 Oportunidades
            </button>
          )}
          {(userRole === 'admin' || userRole === 'employer' || !userRole) && (
            <button 
              onClick={() => setDashboardTab('cadastro')}
              className={`btn ${dashboardTab === 'cadastro' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              📝 Cadastros
            </button>
          )}
          {(userRole === 'admin' || userRole === 'employer' || userRole === 'freelancer' || !userRole) && (
            <button 
              onClick={() => setDashboardTab('financeiro')}
              className={`btn ${dashboardTab === 'financeiro' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              💰 Gestão & PIX
            </button>
          )}
          {userRole === 'admin' && currentUser?.email === 'admin@gigbr.com.br' && (
            <button 
              onClick={() => setDashboardTab('admin')}
              className={`btn ${dashboardTab === 'admin' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ border: '2px dashed var(--color-green)' }}
            >
              🔧 Painel Admin
            </button>
          )}
          {(userRole === 'freelancer' || userRole === 'employer') && (
            <button 
              onClick={() => setDashboardTab('freelancer_dash')}
              className={`btn ${dashboardTab === 'freelancer_dash' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ border: '2px dashed var(--color-green)' }}
            >
              📱 Meu Dashboard
            </button>
          )}
          {currentUser && (currentUser?.cnpj || currentUser?.registrationType === 'PJ') && (
            <button 
              onClick={() => setDashboardTab('marketplace')}
              className={`btn ${dashboardTab === 'marketplace' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ border: '2px dashed #3b82f6', color: '#1d4ed8', backgroundColor: '#eff6ff' }}
            >
              🛒 Marketplace
            </button>
          )}
        </div>

        {/* Global GPS / Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700 }}>{t.gpsRegion}</span>
            <select 
              value={userLocation.region}
              onChange={(e) => mockLocation(e.target.value)}
              className="form-input"
              style={{ width: '130px', padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#f4f4f5' }}
            >
              <option value="SP">São Paulo (SP)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="MG">Minas Gerais (MG)</option>
            </select>
            <button 
              onClick={requestGeolocation} 
              className="btn btn-secondary btn-sm"
              disabled={gpsStatus === 'loading'}
              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
            >
              {gpsStatus === 'loading' ? 'Localizando...' : '📍 GPS'}
            </button>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
            <input 
              type="checkbox" 
              checked={proximityFilterEnabled} 
              onChange={(e) => setProximityFilterEnabled(e.target.checked)}
              style={{ accentColor: 'var(--color-green)' }}
            />
            <span>Região</span>
          </label>

          <button 
            onClick={toggleLanguage} 
            className="btn btn-secondary btn-sm"
          >
            {language === 'pt-BR' ? 'EN' : 'PT'}
          </button>

          <button 
            onClick={() => setCurrentUser(null)} 
            className="btn btn-secondary btn-sm"
            style={{ 
              backgroundColor: '#fee2e2', 
              color: '#991b1b', 
              borderColor: '#fca5a5', 
              fontWeight: 700 
            }}
            title="Sair do sistema"
          >
            🚪 Sair
          </button>

          {/* Ocultado como solicitado: Exibir celular */}
          <button 
            style={{ display: 'none' }}
          >
            📱 Exibir Celular
          </button>
        </div>
      </div>

      {/* Dynamic Tab Contents */}
      
      {/* 1. TALENT DIRECTORY TAB */}
      {dashboardTab === 'talentos' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          
          {/* Subheader and Search controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>Buscar Talentos</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Filtre profissionais individuais, grupos musicais ou produtoras contratantes.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <IconSearch style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)', width: '16px' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={
                    talentSubTab === 'individuais' ? "Nome, OMB, DRT ou CNPJ..." : 
                    (talentSubTab === 'equipes' ? "Nome da banda ou equipe..." : "Nome da produtora ou responsável...")
                  } 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '32px', minWidth: '220px', fontSize: '0.8rem' }}
                />
              </div>

              {talentSubTab !== 'contratantes' && (
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-input"
                  style={{ width: '160px', fontSize: '0.8rem' }}
                >
                  <option value="All">{t.filterAll}</option>
                  <option value="Artistas">Artistas</option>
                  <option value="Músicos">Músicos</option>
                  <option value="Técnicos">Técnicos</option>
                  <option value="Roadies">Roadies</option>
                </select>
              )}
            </div>
          </div>

          {/* Segmented control for Freelancers vs Bands/Groups vs Employers */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid var(--border-color)', 
            marginBottom: '20px', 
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => setTalentSubTab('individuais')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: talentSubTab === 'individuais' ? '3px solid var(--text-main)' : '3px solid transparent',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: talentSubTab === 'individuais' ? 'var(--text-main)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              👤 Profissionais Individuais
            </button>
            <button 
              onClick={() => setTalentSubTab('equipes')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: talentSubTab === 'equipes' ? '3px solid var(--text-main)' : '3px solid transparent',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: talentSubTab === 'equipes' ? 'var(--text-main)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              👥 Equipes & Bandas
            </button>
            <button 
              onClick={() => setTalentSubTab('contratantes')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: talentSubTab === 'contratantes' ? '3px solid var(--text-main)' : '3px solid transparent',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: talentSubTab === 'contratantes' ? 'var(--text-main)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              🏢 Produtoras (Contratantes)
            </button>
          </div>

          {/* Contractors List */}
          {talentSubTab === 'individuais' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredContractors.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Nenhum profissional encontrado com os filtros ativos.
                </div>
              ) : (
                filteredContractors.map(c => (
                  <TalentCard 
                    key={c.id} 
                    contractor={c} 
                    t={t} 
                    onPreHire={(selectedC) => setHiringContractor(selectedC)} 
                    onPropose={(selectedC) => setProposingContractor(selectedC)} 
                  />
                ))
              )}
            </div>
          )}

          {/* Bands/Groups list */}
          {talentSubTab === 'equipes' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredGroups.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Nenhuma equipe ou banda cadastrada na região selecionada.
                </div>
              ) : (
                filteredGroups.map(g => {
                  return (
                    <div key={g.id} className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '14px', minHeight: '270px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {g.avatar ? (
                              <img 
                                src={g.avatar} 
                                alt={g.name} 
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                              />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#64748b' }}>
                                👥
                              </div>
                            )}
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{g.name}</h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📍 {g.city}</span>
                            </div>
                          </div>
                          <span className="badge badge-blue">{g.category}</span>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>{g.description}</p>
                      </div>

                      <div>
                        {/* Display Group members avatars & details */}
                        <div style={{ 
                          backgroundColor: '#f8f9fa', 
                          padding: '10px', 
                          borderRadius: '4px', 
                          border: '1px solid var(--border-color)',
                          marginBottom: '10px'
                        }}>
                          <h5 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            Membros da Equipe ({g.members.length})
                          </h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {g.members.map(memberId => {
                              const member = contractors.find(c => c.id === memberId);
                              if (!member) return null;
                              return (
                                <div 
                                  key={memberId} 
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.7rem' }}
                                  title={member.role}
                                >
                                  <img 
                                    src={member.avatar} 
                                    alt={member.name} 
                                    style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                  <span style={{ fontWeight: 600 }}>{member.name.split(' ')[0]}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: <strong style={{ color: 'var(--color-green)' }}>Disponível</strong></span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const shareUrl = `${window.location.origin}?group=${g.id}`;
                                navigator.clipboard.writeText(shareUrl);
                                alert(`✓ Link de compartilhamento do grupo copiado:\n${shareUrl}`);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.7rem' }}
                            >
                              🔗 Compartilhar
                            </button>
                            <button 
                              onClick={() => alert(`Enviando solicitação de fechamento para a equipe "${g.name}". Todos os membros receberão o aviso.`)}
                              className="btn btn-primary btn-sm"
                            >
                              Contratar Grupo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Employers List (with 3D Flip Card details) */}
          {talentSubTab === 'contratantes' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredEmployers.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Nenhuma produtora contratante cadastrada com os filtros ativos.
                </div>
              ) : (
                filteredEmployers.map(emp => (
                  <EmployerCard key={emp.id} employer={emp} t={t} />
                ))
              )}
            </div>
          )}

        </div>
      )}

      {/* 2. JOB OPPORTUNITIES TAB */}
      {dashboardTab === 'vagas' && (
        <div className="dashboard-grid">
          {/* List of active opportunities */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>Vagas Publicadas</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Oportunidades ativas para prestadores na plataforma GIG BR.</p>
            </div>

            {userRole === 'guest' && (
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: '#ffffff',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 800 }}>👋 Acesso Convidado Temporário</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: 1.4, opacity: 0.9 }}>
                  Você entrou via código de acesso da oportunidade. Clique em <strong>"Candidatar-se"</strong> abaixo para preencher seu cadastro permanente e homologar sua participação.
                </p>
              </div>
            )}

            {/* Hiring Mode Spec Explanation */}
            <div style={{ 
              backgroundColor: '#f4f4f5', 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-color)', 
              marginBottom: '18px', 
              fontSize: '0.8rem',
              lineHeight: 1.4
            }}>
              <p>💡 <strong>Políticas de Contratação das Produtoras:</strong></p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                Os contratantes na rede GIG BR indicam suas exigências fiscais. Algumas vagas exigem emissão de <strong>Nota Fiscal de MEI (CNPJ)</strong>, enquanto outras aceitam a <strong>Contratação Direta Autônoma (RPA/CPF)</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredJobs.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Nenhuma vaga cadastrada na região selecionada.
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div key={job.id} className="glass-panel" style={{ padding: '18px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{job.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{job.company}</span>
                      </div>
                      <span className="badge badge-blue">{job.category}</span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.description}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '6px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span>📍 {job.location}</span>
                        <span>💵 Cache: <strong style={{ color: 'var(--color-green)' }}>{job.payment}</strong></span>
                        <span>📅 {job.date}</span>
                      </div>

                      <button 
                        onClick={() => handleApplyOpportunity(job)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px' }}
                      >
                        Candidatar-se
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form to post new job */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '14px' }}>Cadastrar Oportunidade</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Publique um novo cachê ou oportunidade de trabalho para atrair MEIs homologados.</p>

            {jobSuccess && (
              <div style={{ backgroundColor: 'var(--color-green-light)', color: '#047857', padding: '10px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                🎉 Oportunidade publicada com sucesso na rede GIG BR!
              </div>
            )}

            <form onSubmit={handleJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Título da Vaga</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Ex: Roadie de Bateria, Técnico de Iluminação"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Categoria</label>
                  <select 
                    value={jobForm.category}
                    onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
                    className="form-input"
                  >
                    <option value="Artistas">Artistas</option>
                    <option value="Músicos">Músicos</option>
                    <option value="Técnicos">Técnicos</option>
                    <option value="Roadies">Roadies</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cachê Líquido (R$)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    placeholder="Valor em Reais"
                    required
                    value={jobForm.payment}
                    onChange={(e) => setJobForm({...jobForm, payment: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Data da Gig</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={jobForm.date}
                    onChange={(e) => setJobForm({...jobForm, date: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cidade / Região</label>
                  <select 
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="form-input"
                  >
                    <option value="São Paulo - SP">São Paulo - SP</option>
                    <option value="Rio de Janeiro - RJ">Rio de Janeiro - RJ</option>
                    <option value="Belo Horizonte - MG">Belo Horizonte - MG</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Descrição das Atividades</label>
                <textarea 
                  className="form-input"
                  rows="4"
                  placeholder="Descreva as responsabilidades, horários de montagem e requisitos técnicos do profissional..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '6px' }}>
                Publicar Vaga
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. REGISTRATION ONBOARDING FORMS */}
      {dashboardTab === 'cadastro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: userRole === 'freelancer' ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', maxWidth: userRole === 'freelancer' ? '600px' : 'none', width: '100%', margin: userRole === 'freelancer' ? '0 auto' : '0' }}>
            
            {/* Freelancer Form (Supports PF/PJ & OMB/DRT credentials & Bio & full states list) */}
            <div className="glass-panel" style={{ padding: '24px', display: userRole === 'freelancer' ? 'none' : 'block' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>Ficha do Profissional</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cadastre seu perfil de prestação autônomo ou MEI.</p>
              </div>

              {freelancerSuccess && (
                <div style={{ backgroundColor: 'var(--color-green-light)', color: '#047857', padding: '10px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                  🎉 Profissional cadastrado e homologado com sucesso!
                </div>
              )}

              <form onSubmit={handleFreelancerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Radio Button Selector for PF vs PJ */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Regime de Contratação</label>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="registrationType" 
                        value="PJ"
                        checked={freelancerForm.registrationType === 'PJ'}
                        onChange={() => setFreelancerForm({...freelancerForm, registrationType: 'PJ', pixType: 'CNPJ'})}
                        style={{ accentColor: 'var(--color-green)' }}
                      />
                      <span>Pessoa Jurídica (MEI / CNPJ)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="registrationType" 
                        value="PF"
                        checked={freelancerForm.registrationType === 'PF'}
                        onChange={() => setFreelancerForm({...freelancerForm, registrationType: 'PF', pixType: 'CPF'})}
                        style={{ accentColor: 'var(--color-green)' }}
                      />
                      <span>Pessoa Física (Autônomo / CPF)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nome completo do prestador" 
                    required
                    value={freelancerForm.name}
                    onChange={(e) => setFreelancerForm({...freelancerForm, name: e.target.value})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Função Principal</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Guitarrista, Roadie, Iluminador" 
                      required
                      value={freelancerForm.role}
                      onChange={(e) => setFreelancerForm({...freelancerForm, role: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Categoria de Atuação</label>
                    <select 
                      value={freelancerForm.category}
                      onChange={(e) => setFreelancerForm({...freelancerForm, category: e.target.value})}
                      className="form-input"
                    >
                      <option value="Músicos">Músicos</option>
                      <option value="Artistas">Artistas (Atores, Dançarinos)</option>
                      <option value="Técnicos">Técnicos</option>
                      <option value="Roadies">Roadies</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic OMB / DRT Document Selection based on category */}
                <div>
                  {freelancerForm.category === 'Músicos' ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                        Registro OMB (Ordem dos Músicos do Brasil) - (Opcional)
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: OMB/SP 54932 (Opcional)" 
                        value={freelancerForm.omb}
                        onChange={(e) => setFreelancerForm({...freelancerForm, omb: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                        Registro Profissional DRT - (Opcional)
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: DRT/Artistas 99318 (Opcional)" 
                        value={freelancerForm.drt}
                        onChange={(e) => setFreelancerForm({...freelancerForm, drt: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                      CNPJ MEI {freelancerForm.registrationType === 'PF' && '(Desativado PF)'}
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="00.000.000/0001-00" 
                      required={freelancerForm.registrationType === 'PJ'}
                      disabled={freelancerForm.registrationType === 'PF'}
                      value={freelancerForm.cnpj}
                      onChange={(e) => setFreelancerForm({...freelancerForm, cnpj: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>CPF do Titular</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="000.000.000-00" 
                      required
                      value={freelancerForm.cpf}
                      onChange={(e) => setFreelancerForm({...freelancerForm, cpf: e.target.value})}
                    />
                  </div>
                </div>

                {/* City Text Field + States Dropdown List */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cidade</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Campinas, Belo Horizonte" 
                      required
                      value={freelancerForm.city}
                      onChange={(e) => setFreelancerForm({...freelancerForm, city: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Estado</label>
                    <select 
                      value={freelancerForm.state}
                      onChange={(e) => setFreelancerForm({...freelancerForm, state: e.target.value})}
                      className="form-input"
                    >
                      {BRAZILIAN_STATES.map(st => (
                        <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Profile Picture Upload & Social Pull Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Foto de Perfil (Max 2MB)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="form-input" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("Erro: O tamanho da imagem não pode ultrapassar o limite de 2MB.");
                            e.target.value = "";
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFreelancerForm({...freelancerForm, avatar: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ fontSize: '0.7rem', padding: '6px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button 
                      type="button" 
                      onClick={() => {
                        const randomFaces = [
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
                        ];
                        const chosen = randomFaces[Math.floor(Math.random() * randomFaces.length)];
                        setFreelancerForm({...freelancerForm, avatar: chosen});
                        alert("Foto de perfil sincronizada com sua conta social com sucesso!");
                      }}
                      className="btn btn-secondary" 
                      style={{ width: '100%', fontSize: '0.7rem', padding: '10px 4px' }}
                    >
                      🔄 Puxar da Social
                    </button>
                  </div>
                </div>

                {/* Contact Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>E-mail de Contato</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="email@dominio.com"
                      required
                      value={freelancerForm.email}
                      onChange={(e) => setFreelancerForm({...freelancerForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Telefone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="(00) 99999-9999"
                      required
                      value={freelancerForm.phone}
                      onChange={(e) => setFreelancerForm({...freelancerForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Chave PIX Recebimento</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Celular, E-mail ou CPF/CNPJ" 
                    required
                    value={freelancerForm.pixKey}
                    onChange={(e) => setFreelancerForm({...freelancerForm, pixKey: e.target.value})}
                  />
                </div>

                {/* Professional Bio Input (max 250 characters) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Resumo Profissional / Bio</label>
                    <span style={{ fontSize: '0.65rem', color: (freelancerForm.bio || '').length >= 250 ? 'var(--color-red)' : 'var(--text-muted)' }}>
                      {(freelancerForm.bio || '').length}/250
                    </span>
                  </div>
                  <textarea 
                    className="form-input"
                    rows="3"
                    placeholder="Descreva suas experiências de show, palcos e competências técnicas em poucas palavras..."
                    maxLength="250"
                    value={freelancerForm.bio}
                    onChange={(e) => setFreelancerForm({...freelancerForm, bio: e.target.value})}
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                  Enviar Ficha do Prestador
                </button>
              </form>
            </div>

            {/* Employer Form with Hiring preference policy and Bio */}
            <div className="glass-panel" style={{ padding: '24px', display: userRole === 'freelancer' ? 'none' : 'block' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>Cadastro de Contratante</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cadastre sua produtora para gerenciar escalas de gigs.</p>
              </div>

              {employerSuccess && (
                <div style={{ backgroundColor: 'var(--color-green-light)', color: '#047857', padding: '10px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                  🎉 Cadastro de Contratante realizado com sucesso!
                </div>
              )}

              <form onSubmit={handleEmployerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Hiring mode policy */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Exigência de Faturamento</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="hiringMode" 
                        value="NF"
                        checked={employerForm.hiringMode === 'NF'}
                        onChange={() => setEmployerForm({...employerForm, hiringMode: 'NF'})}
                        style={{ accentColor: 'var(--color-green)' }}
                      />
                      <span>Exige Nota Fiscal (Contrata apenas MEI/CNPJ)</span>
                    </label>

                    {employerForm.hiringMode === 'NF' && (
                      <div style={{ backgroundColor: '#f4f4f5', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', marginLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                          Regra para Emissão de Nota
                        </label>
                        <select 
                          value={employerForm.thirdPartyInvoice}
                          onChange={(e) => setEmployerForm({...employerForm, thirdPartyInvoice: e.target.value})}
                          className="form-input"
                          style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          <option value="OWN_ONLY">Emitida apenas pelo próprio contratado (CNPJ MEI do titular)</option>
                          <option value="THIRD_PARTY_OK">Aceita nota de terceiros (desde que o CNAE respeite a função)</option>
                        </select>
                      </div>
                    )}

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="hiringMode" 
                        value="DIRETA"
                        checked={employerForm.hiringMode === 'DIRETA'}
                        onChange={() => setEmployerForm({...employerForm, hiringMode: 'DIRETA'})}
                        style={{ accentColor: 'var(--color-green)' }}
                      />
                      <span>Aceita Contratação Direta (Autônoma / Recibo PF)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Razão Social / Empresa</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nome da empresa ou produtora" 
                    required
                    value={employerForm.companyName}
                    onChange={(e) => setEmployerForm({...employerForm, companyName: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Nome do Responsável</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nome do produtor principal" 
                    required
                    value={employerForm.name}
                    onChange={(e) => setEmployerForm({...employerForm, name: e.target.value})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>CNPJ Corporativo</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="00.000.000/0001-00" 
                      required
                      value={employerForm.cnpj}
                      onChange={(e) => setEmployerForm({...employerForm, cnpj: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Telefone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="(00) 99999-9999" 
                      required
                      value={employerForm.phone}
                      onChange={(e) => setEmployerForm({...employerForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                {/* City input + States dropdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cidade da Operação</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: São Paulo, Niterói" 
                      required
                      value={employerForm.city}
                      onChange={(e) => setEmployerForm({...employerForm, city: e.target.value})}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Estado</label>
                    <select 
                      value={employerForm.state}
                      onChange={(e) => setEmployerForm({...employerForm, state: e.target.value})}
                      className="form-input"
                    >
                      {BRAZILIAN_STATES.map(st => (
                        <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Employer Bio Description (max 250 characters) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Apresentação / Descrição da Produtora</label>
                    <span style={{ fontSize: '0.65rem', color: (employerForm.bio || '').length >= 250 ? 'var(--color-red)' : 'var(--text-muted)' }}>
                      {(employerForm.bio || '').length}/250
                    </span>
                  </div>
                  <textarea 
                    className="form-input"
                    rows="3"
                    placeholder="Descreva o nicho de eventos da sua produtora e exigências profissionais gerais..."
                    maxLength="250"
                    value={employerForm.bio}
                    onChange={(e) => setEmployerForm({...employerForm, bio: e.target.value})}
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                  Enviar Ficha do Contratante
                </button>
              </form>
            </div>
          </div>

          {/* Form: Formar Banda / Equipe */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>Formar Banda ou Equipe Técnica</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Una vários profissionais cadastrados para criar uma equipe conjunta ou banda musical.</p>
            </div>

            {groupSuccess && (
              <div style={{ backgroundColor: 'var(--color-green-light)', color: '#047857', padding: '10px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                🎉 Banda / Equipe cênica formada com sucesso! Disponível no diretório.
              </div>
            )}

            <form onSubmit={handleGroupSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Nome do Grupo / Banda</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Quinteto de Metais BR, Equipe Som e Luz Anhembi" 
                    required
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Categoria Principal</label>
                    <select 
                      value={groupForm.category}
                      onChange={(e) => setGroupForm({...groupForm, category: e.target.value})}
                      className="form-input"
                    >
                      <option value="Músicos">Músicos (Bandas, Orquestras)</option>
                      <option value="Artistas">Artistas (Atores, Companhia)</option>
                      <option value="Técnicos">Técnicos (Equipe Som/Luz)</option>
                      <option value="Roadies">Roadies (Equipe de Apoio)</option>
                    </select>
                  </div>

                  {/* City input + States dropdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cidade</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: São Paulo" 
                        required
                        value={groupForm.city}
                        onChange={(e) => setGroupForm({...groupForm, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>UF</label>
                      <select 
                        value={groupForm.state}
                        onChange={(e) => setGroupForm({...groupForm, state: e.target.value})}
                        className="form-input"
                      >
                        {BRAZILIAN_STATES.map(st => (
                          <option key={st.code} value={st.code}>{st.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>E-mail de Contato do Grupo (Obrigatório)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="Ex: banda@contato.com.br" 
                      required
                      value={groupForm.email}
                      onChange={(e) => setGroupForm({...groupForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Foto de Perfil (Max 2MB)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("A foto do grupo deve ter no máximo 2MB!");
                            e.target.value = "";
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setGroupForm({...groupForm, avatar: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Apresentação / Descrição da Equipe</label>
                  <textarea 
                    className="form-input" 
                    rows="3"
                    placeholder="Fale brevemente sobre o repertório ou capacidade técnica da equipe..." 
                    required
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Members Selection List */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Selecionar Integrantes ({groupForm.selectedMembers.length} selecionados)
                </label>
                <div style={{ 
                  flexGrow: 1, 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '8px',
                  backgroundColor: '#ffffff'
                }}>
                  {contractors.map(c => {
                    const isSelected = groupForm.selectedMembers.includes(c.id);
                    return (
                      <label 
                        key={c.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          padding: '6px 8px', 
                          borderRadius: '3px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--color-green-light)' : 'transparent',
                          fontSize: '0.75rem',
                          marginBottom: '4px'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleMemberToggle(c.id)}
                          style={{ accentColor: 'var(--color-green)' }}
                        />
                        <span style={{ fontWeight: 600 }}>{c.name} ({c.role.substring(0, 15)}...)</span>
                      </label>
                    );
                  })}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Formar Equipe / Banda
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* 4. FINANCIAL & SHIFTS CHECKOUT TAB (Original Event-UK manager panel) */}
      {dashboardTab === 'financeiro' && (
        <div className="dashboard-grid">
          
          {/* Main left manager column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Event Budget Monitor Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{t.budgetStatus}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>{activeEvent?.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    📍 {activeEvent?.location}
                  </p>
                </div>
                
                <span className={`badge ${isBudgetWarning ? 'badge-red pulse-active' : 'badge-green'}`}>
                  {isBudgetWarning ? t.warningClose : 'Orçamento OK'}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e4e4e7', borderRadius: '4px', overflow: 'hidden', marginBottom: '18px' }}>
                <div style={{
                  width: `${Math.min(percentSpent, 100)}%`,
                  height: '100%',
                  backgroundColor: isBudgetWarning ? '#ef4444' : 'var(--color-green)',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>

              {/* Financial values */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{t.budgetUsage}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>R$ {activeEvent?.currentSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{t.budgetCap}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>R$ {activeEvent?.budgetLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Status do Show</p>
                  <span className={`badge ${activeEvent?.vesselStatus === 'Ativo' ? 'badge-blue' : 'badge-gray'}`} style={{ marginTop: '4px' }}>
                    {activeEvent?.vesselStatus}
                  </span>
                </div>
              </div>

              {activeEvent && (userRole === 'admin' || (userRole === 'employer' && activeEvent?.employer_id === currentUser?.id)) && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <button 
                    onClick={() => handleEventEditStart(activeEvent)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    ✏️ Editar Show
                  </button>
                  <button 
                    onClick={() => handleEventDelete(activeEvent.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', borderColor: '#f87171', color: '#ef4444' }}
                  >
                    🗑️ Excluir Show
                  </button>
                </div>
              )}
            </div>

            {/* Crowdfunding Wallet Card */}
            {activeEvent && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Meta de Arrecadação (Crowdfunding)</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px' }}>Apoio Coletivo do Show</h4>
                  </div>
                  
                  {activeEvent.crowdfundGoal > 0 && (
                    <span className="badge badge-blue">
                      {Math.round(((activeEvent.crowdfundRaised || 0) / activeEvent.crowdfundGoal) * 100)}% Apoiado
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {activeEvent.crowdfundGoal > 0 && (
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e4e4e7', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{
                      width: `${Math.min(((activeEvent.crowdfundRaised || 0) / activeEvent.crowdfundGoal) * 100, 100)}%`,
                      height: '100%',
                      backgroundColor: 'var(--color-blue)',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Arrecadado</p>
                    <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-blue)' }}>
                      R$ {(activeEvent.crowdfundRaised || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Meta do Show</p>
                    <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      R$ {(activeEvent.crowdfundGoal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Centralizador PIX (Produtor do Evento)
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      🔑 Chave PIX: <strong>{activeEvent.pixKey || activeEvent.pix_key || (activeEvent.employer_id === 'admin-1' ? 'admin@gigbr.com.br' : 'roberto@globo.com.br')}</strong>
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Todo valor enviado para esta chave acumula na carteira deste evento.
                    </p>
                  </div>

                  <form onSubmit={handleCrowdfundContribution} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <input 
                      type="number" 
                      placeholder="Valor R$ (ex: 50)" 
                      required 
                      min="1"
                      className="form-input"
                      value={crowdfundAmount}
                      onChange={(e) => setCrowdfundAmount(e.target.value)}
                      style={{ flex: 1, padding: '8px', fontSize: '0.8rem', backgroundColor: '#ffffff' }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                      ⚡ Apoiar via PIX
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Shifts verification and settlement table */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>{t.shiftsVerif}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Aprove relatórios de horas extras e liquide via PIX.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconCalendar style={{ color: 'var(--text-secondary)', width: '16px', height: '16px' }} />
                  <select 
                    value={activeEventId}
                    onChange={(e) => setActiveEventId(e.target.value)}
                    className="form-input"
                    style={{ padding: '6px 10px', minWidth: '220px', fontSize: '0.8rem' }}
                  >
                    {filteredEvents.length === 0 ? (
                      <option value="" disabled>Nenhum show na região</option>
                    ) : (
                      filteredEvents.map(evt => (
                        <option key={evt.id} value={evt.id}>{evt.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.contractorName}</th>
                      <th>{t.category}</th>
                      <th style={{ textAlign: 'center' }}>Horas (Real/Prev)</th>
                      <th style={{ textAlign: 'center' }}>{t.status}</th>
                      <th style={{ textAlign: 'center' }}>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventShifts.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          Nenhum prestador escalado para este show.
                        </td>
                      </tr>
                    ) : (
                      eventShifts.map(shift => {
                        const contractor = contractors.find(c => c.id === shift.contractorId);
                        if (!contractor) return null;
                        
                        return (
                          <tr key={shift.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img 
                                  src={contractor.avatar} 
                                  alt={contractor.name} 
                                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                                />
                                <div>
                                  <p style={{ fontWeight: 600 }}>{contractor.name}</p>
                                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    {contractor.cnpj ? `MEI: ${contractor.cnpj}` : `PF: ${contractor.cpf || 'Autônomo'}`}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p style={{ fontWeight: 600 }}>{contractor.role}</p>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>R$ {(shift.hourlyRate || 0).toFixed(2)}/h</p>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {adjustingShiftId === shift.id ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                  <input 
                                    type="number" 
                                    value={adjustedHours}
                                    onChange={(e) => setAdjustedHours(e.target.value)}
                                    className="form-input"
                                    style={{ width: '70px', padding: '4px 8px', fontSize: '0.8rem' }}
                                  />
                                  <button onClick={() => handleAdjustSave(shift.id)} className="btn btn-primary btn-sm" style={{ padding: '6px' }}>
                                    Salvar
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <p style={{ fontWeight: 700 }}>
                                    {shift.actualHours !== null ? `${shift.actualHours}h` : `${shift.scheduledHours}h`}
                                  </p>
                                  {shift.checkInTime && (
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                      ⏱️ {shift.checkInTime} → {shift.checkOutTime || 'Ativo'}
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {shift.status === 'Pago' && <span className="badge badge-green">{t.paid}</span>}
                              {shift.status === 'Disputado' && <span className="badge badge-red pulse-active">{t.disputed}</span>}
                              {shift.status === 'Finalizado' && <span className="badge badge-yellow">{t.completed}</span>}
                              {shift.status === 'Em Andamento' && <span className="badge badge-blue">{t.activeOnsite}</span>}
                              {shift.status === 'Agendado' && <span className="badge badge-gray">{t.scheduled}</span>}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                {(userRole === 'admin' || userRole === 'employer') ? (
                                  (shift.status === 'Finalizado' || shift.status === 'Disputado') && (
                                    <>
                                      <button 
                                        onClick={() => openPixPayment(shift.id)}
                                        className="btn btn-primary btn-sm"
                                        style={{ display: 'inline-flex', gap: '4px', padding: '6px 10px', fontSize: '0.7rem' }}
                                      >
                                        <IconPixSymbol style={{ width: '12px', height: '12px' }} /> {t.payPix}
                                      </button>
                                      {shift.status === 'Disputado' && (
                                        <button 
                                          onClick={() => handleAdjustStart(shift)}
                                          className="btn btn-secondary btn-sm"
                                          style={{ fontSize: '0.7rem' }}
                                        >
                                          Ajustar
                                        </button>
                                      )}
                                    </>
                                  )
                                ) : (
                                  (shift.status === 'Finalizado' || shift.status === 'Disputado') && (
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Aguardando liberação</span>
                                  )
                                )}
                                {shift.status === 'Pago' && (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <IconCheck style={{ color: 'var(--color-green)', width: '12px' }} /> Comprovante OK
                                  </span>
                                )}
                                {shift.status === 'Em Andamento' && (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Trabalhando no local</span>
                                )}
                                {shift.status === 'Agendado' && (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Aguardando Check-in</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column container (Realtime Sync & Cost Controls) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Histórico Individual do Evento */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>Histórico do Show</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Ações e auditoria específicas de {activeEvent?.name || 'evento selecionado'}.
                </p>
              </div>

              <div className="notification-list">
                {notifications.filter(n => n.eventId === activeEventId).length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '20px 0' }}>
                    Nenhuma atividade registrada para este show.
                  </div>
                ) : (
                  notifications.filter(n => n.eventId === activeEventId).map(n => (
                    <div key={n.id} className={`notification-item sender-${n.sender}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.65rem', marginBottom: '2px' }}>
                        <span>{n.sender === 'web' ? t.webAction : (n.sender === 'mobile' ? t.mobileAction : 'SISTEMA')}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{n.timestamp}</span>
                      </div>
                      <p style={{ color: 'var(--text-main)' }}>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Crew Cost Allocations Form (Controle de Custos Humanos) */}
            {userRole === 'employer' && activeEvent && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Alocação de Equipe (Custos Humanos)</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Aloque prestadores da plataforma ao evento para compor a folha de custos.
                </p>

                <form onSubmit={handleCrewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {crewSuccess && (
                    <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#047857', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✓ Profissional alocado com sucesso!
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Selecionar Profissional (Freelancer)</label>
                    <select 
                      className="form-input" required
                      value={crewForm.contractorId}
                      onChange={(e) => setCrewForm({ ...crewForm, contractorId: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '8px', backgroundColor: '#ffffff', color: 'var(--text-main)' }}
                    >
                      <option value="">-- Selecione o Profissional --</option>
                      {contractors.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.role} - {c.city})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Horas Previstas</label>
                      <input 
                        type="number" className="form-input" required min="1"
                        value={crewForm.scheduledHours}
                        onChange={(e) => setCrewForm({ ...crewForm, scheduledHours: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Valor da Hora (R$)</label>
                      <input 
                        type="number" className="form-input" required min="1"
                        value={crewForm.hourlyRate}
                        onChange={(e) => setCrewForm({ ...crewForm, hourlyRate: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '8px' }}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    Alocar na Equipe
                  </button>
                </form>
              </div>
            )}

            {/* Create Event Form */}
            {userRole === 'employer' && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '14px' }}>Cadastrar Novo Show/Evento</h4>
                {!currentUser.cnpj ? (
                  <div style={{ backgroundColor: '#fffbeb', border: '1px solid #f59e0b', color: '#b45309', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                    ⚠️ Apenas produtores cadastrados com CNPJ podem criar novos eventos no sistema.
                  </div>
                ) : (
                  <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {eventSuccess && (
                      <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#047857', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                        ✓ Evento criado com sucesso!
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome do Evento</label>
                      <input 
                        type="text" className="form-input" required placeholder="Carnaval, Festival de Jazz, etc."
                        value={eventForm.name}
                        onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '8px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Data</label>
                        <input 
                          type="date" className="form-input" required
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          style={{ fontSize: '0.8rem', padding: '8px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Localidade</label>
                        <input 
                          type="text" className="form-input" required placeholder="São Paulo - SP"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          style={{ fontSize: '0.8rem', padding: '8px' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Limite de Verba / Budget (R$)</label>
                        <input 
                          type="number" className="form-input" required placeholder="120000"
                          value={eventForm.budgetLimit}
                          onChange={(e) => setEventForm({ ...eventForm, budgetLimit: e.target.value })}
                          style={{ fontSize: '0.8rem', padding: '8px', backgroundColor: '#ffffff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Meta Crowdfunding (R$)</label>
                        <input 
                          type="number" className="form-input" required placeholder="50000"
                          value={eventForm.crowdfundGoal}
                          onChange={(e) => setEventForm({ ...eventForm, crowdfundGoal: e.target.value })}
                          style={{ fontSize: '0.8rem', padding: '8px', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Chave PIX Centralizada do Show</label>
                      <input 
                        type="text" className="form-input" required placeholder="Chave PIX (E-mail, CNPJ, etc.)"
                        value={eventForm.pixKey}
                        onChange={(e) => setEventForm({ ...eventForm, pixKey: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '8px', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Descrição / Detalhamento do Evento (Obrigatório)</label>
                      <textarea 
                        className="form-input" required rows="3" placeholder="Detalhes importantes do show, infraestrutura, cronograma, etc."
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '8px', resize: 'none', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      Criar Show/Evento
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 50% Prepayment / Pre-Hire Deposit Modal */}
      {hiringContractor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(24, 24, 27, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🛡️</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
              Garantia de Contratação (50% Sinal)
            </h3>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.4 }}>
              Para confirmar a contratação de <strong>{hiringContractor.name}</strong>, é exigida a transferência antecipada de <strong>50% do cachê previsto</strong> para garantir a agenda do artista/técnico.
            </p>

            <div style={{
              backgroundColor: '#f4f4f5',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              textAlign: 'left',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Profissional:</span>
                <span style={{ fontWeight: 700 }}>{hiringContractor.name} ({hiringContractor.role})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cachê Previsto (8h):</span>
                <span style={{ fontWeight: 700 }}>R$ 400,00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-green)' }}>Sinal Exigido (50%):</span>
                <span style={{ fontWeight: 800, color: 'var(--color-green)' }}>R$ 200,00</span>
              </div>
            </div>

            {/* PIX details */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ 
                width: '140px', 
                height: '140px', 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '8px'
              }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020101021126580014br.gov.pix.prod0136200.005204000053039865802BR5920GoIAGigPrepayment6009SaoPaulo62070503***63041A3F`} 
                  alt="PIX Deposit QR Code" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText('00020101021126580014br.gov.pix.prod0136200.005204000053039865802BR5920GoIAGigPrepayment6009SaoPaulo62070503***63041A3F');
                  setDepositPIXCopied(true);
                  setTimeout(() => setDepositPIXCopied(false), 2000);
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                {depositPIXCopied ? '✅ Copiado!' : '📋 Copiar Código PIX'}
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setHiringContractor(null)} 
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Voltar
              </button>
              <button 
                onClick={() => {
                  preHireWithDeposit(hiringContractor.id, activeEventId, 400.00);
                  const targetEmail = hiringContractor.email || `${hiringContractor.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
                  alert(`Solicitação de contratação realizada com sucesso!\n\nUma notificação com a ficha do show e a confirmação de segurança (50% de sinal) foi enviada diretamente para a caixa postal do profissional em:\n📧 ${targetEmail}`);
                  setHiringContractor(null);
                }} 
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Confirmar Depósito (50%)
              </button>
            </div>

          </div>
        </div>
      )}



      {/* 5. CENTRAL ADMINISTRATOR DASHBOARD PANEL */}
      {dashboardTab === 'admin' && currentUser?.email !== 'admin@gigbr.com.br' && (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>
          ⚠️ Acesso Negado. Apenas o administrador central autorizado (admin@gigbr.com.br) tem permissão de acesso.
        </div>
      )}
      {dashboardTab === 'admin' && currentUser?.email === 'admin@gigbr.com.br' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '16px 24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, color: '#0f172a' }}>⚙️ Painel do Administrador Central</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>Gerenciamento global de usuários, grupos, permissões e homologações.</p>
            </div>
            <button 
              onClick={() => setCurrentUser(null)} 
              className="btn btn-secondary btn-sm"
              style={{ backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5', fontWeight: 700, padding: '8px 16px' }}
            >
              🚪 Sair do Sistema
            </button>
          </div>
          
          {/* Admin Header Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass-panel card-glow" style={{ padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem' }}>👥</span>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Usuários Cadastrados</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-blue)', marginTop: '4px' }}>
                {(contractors?.length || 0) + (employers?.length || 0)}
              </p>
            </div>
            <div className="glass-panel card-glow" style={{ padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem' }}>🎸</span>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Grupos / Bandas</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-green)', marginTop: '4px' }}>
                {groups?.length || 0}
              </p>
            </div>
            <div className="glass-panel card-glow" style={{ padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem' }}>💼</span>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Vagas Publicadas</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-yellow)', marginTop: '4px' }}>
                {jobOpportunities?.length || 0}
              </p>
            </div>
            <div className="glass-panel card-glow" style={{ padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem' }}>⏰</span>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Escalas Ativas</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {shifts?.length || 0}
              </p>
            </div>
          </div>

          {/* Central User Directory Admin */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔧 Administrar Usuários da Plataforma
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Usuário</th>
                    <th style={{ padding: '12px' }}>Role / Tipo</th>
                    <th style={{ padding: '12px' }}>Contato / E-mail</th>
                    <th style={{ padding: '12px' }}>Documento / CPF/CNPJ</th>
                    <th style={{ padding: '12px' }}>Homologação</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contractors.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={c.avatar} alt={c.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <strong style={{ display: 'block' }}>{c.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.category}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>
                          Prestador
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{c.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.phone || 'Sem telefone'}</div>
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                        {c.cpf || c.cnpj || 'Não Informado'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '100px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: c.isVetted ? '#d1fae5' : '#fee2e2',
                          color: c.isVetted ? '#065f46' : '#991b1b'
                        }}>
                          {c.isVetted ? 'Homologado' : 'Pendente'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => updateContractor(c.id, { isVetted: !c.isVetted })}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                          >
                            {c.isVetted ? 'Rebaixar' : 'Homologar'}
                          </button>
                          <button 
                            onClick={() => setEditingUser(c)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#e2e8f0', color: '#1f2937', border: '1px solid #cbd5e1' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Deseja realmente deletar o prestador ${c.name}?`)) {
                                deleteUserAdmin(c.id);
                              }
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff' }}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {employers.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px' }}>
                        <strong>{e.companyName}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resp: {e.name}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                          Contratante
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {e.email || 'roberto@globo.com.br'}
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                        {e.cnpj || 'PJ'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#d1fae5', color: '#065f46' }}>
                          Ativo
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => setEditingUser({ ...e, isEmployer: true })}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#e2e8f0', color: '#1f2937', border: '1px solid #cbd5e1' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Deseja realmente deletar a produtora ${e.companyName}?`)) {
                                deleteUserAdmin(e.id);
                              }
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff' }}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Central Groups Admin */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎸 Administrar Grupos & Bandas
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Grupo / Banda</th>
                    <th style={{ padding: '12px' }}>Categoria</th>
                    <th style={{ padding: '12px' }}>Líder do Grupo</th>
                    <th style={{ padding: '12px' }}>Cidade</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Integrantes</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map(g => {
                    const leader = contractors.find(c => c.id === g.leader_id || c.id === g.members?.[0]);
                    return (
                      <tr key={g.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}>
                          <strong>{g.name}</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{g.description}</p>
                        </td>
                        <td style={{ padding: '12px' }}>{g.category}</td>
                        <td style={{ padding: '12px' }}>{leader ? leader.name : 'Não definido'}</td>
                        <td style={{ padding: '12px' }}>{g.city}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>
                          {g.members?.length || 1}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => setEditingGroup(g)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#e2e8f0', color: '#1f2937', border: '1px solid #cbd5e1' }}
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Deseja realmente deletar o grupo ${g.name}?`)) {
                                  deleteGroupAdmin(g.id);
                                }
                              }}
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff' }}
                            >
                              Remover Grupo
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Central Opportunities Admin */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💼 Administrar Vagas & Oportunidades
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Oportunidade</th>
                    <th style={{ padding: '12px' }}>Categoria</th>
                    <th style={{ padding: '12px' }}>Cachê Oferecido</th>
                    <th style={{ padding: '12px' }}>Data</th>
                    <th style={{ padding: '12px' }}>Localização</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {jobOpportunities.map(opp => (
                    <tr key={opp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px' }}>
                        <strong>{opp.title}</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{opp.description}</p>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-blue">{opp.category}</span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--color-green)' }}>
                        {opp.payment}
                      </td>
                      <td style={{ padding: '12px' }}>{opp.date}</td>
                      <td style={{ padding: '12px' }}>{opp.location}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => setEditingOpportunity(opp)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#e2e8f0', color: '#1f2937', border: '1px solid #cbd5e1' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir a vaga "${opp.title}"?`)) {
                                deleteOpportunityAdmin(opp.id);
                              }
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff' }}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 6. LOGGED FREELANCER PERSONAL DASHBOARD */}
      {dashboardTab === 'freelancer_dash' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="responsive-freelancer-grid">
          
          {/* Left Column: Wallet, Active Gig and Groups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Wallet Panel */}
            <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  💳 Minha Carteira GIG BR
                </h3>
                <span style={{ fontSize: '1.5rem' }}>💰</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Saldo Recebido (PIX)</span>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-green)' }}>
                    R$ {shifts.filter(s => s.contractorId === currentUser?.id && s.status === 'Pago')
                      .reduce((acc, curr) => acc + (curr.actualHours || curr.scheduledHours) * curr.hourlyRate, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pendente Liberação</span>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-yellow)' }}>
                    R$ {shifts.filter(s => s.contractorId === currentUser?.id && s.status === 'Finalizado')
                      .reduce((acc, curr) => acc + (curr.actualHours || curr.scheduledHours) * curr.hourlyRate, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Gigs Concluídas: <strong>{shifts.filter(s => s.contractorId === currentUser?.id && (s.status === 'Pago' || s.status === 'Finalizado')).length}</strong></span>
                <span>Chave PIX Ativa: <strong style={{ fontFamily: 'monospace' }}>{currentUser?.pixKey || currentUser?.cpf || 'Não cadastrada'}</strong></span>
              </div>

              <div style={{ marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '16px', fontSize: '0.8rem', textAlign: 'left' }}>
                <p style={{ fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>⚙️ Configurar Minha Chave PIX</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const key = form.elements.pixKeyInput.value;
                  const type = form.elements.pixTypeSelect.value;
                  try {
                    await updateContractor(currentUser.id, { pixKey: key, pixType: type });
                    setCurrentUser(prev => ({ ...prev, pixKey: key, pixType: type }));
                    alert("Chave PIX atualizada com sucesso!");
                  } catch(err) {
                    alert("Erro ao atualizar chave PIX: " + err.message);
                  }
                }} style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    name="pixTypeSelect"
                    defaultValue={currentUser?.pixType || 'CPF'}
                    className="form-input"
                    style={{ flex: '0 0 80px', padding: '6px', fontSize: '0.75rem', backgroundColor: '#1e293b', color: '#ffffff', borderColor: '#334155' }}
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="Email">E-mail</option>
                    <option value="Telefone">Celular</option>
                    <option value="Chave Aleatoria">Aleatória</option>
                  </select>
                  <input 
                    name="pixKeyInput"
                    type="text"
                    defaultValue={currentUser?.pixKey || ''}
                    placeholder="Sua chave PIX"
                    required
                    className="form-input"
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem', backgroundColor: '#1e293b', color: '#ffffff', borderColor: '#334155' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    Salvar
                  </button>
                </form>
              </div>
            </div>

            {/* Active scheduled Gig check-in console */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>
                ⏱ Console de Escala & Ponto Eletrônico
              </h3>

              {(() => {
                const todayShift = shifts.find(s => s.contractorId === currentUser?.id && (s.status === 'Agendado' || s.status === 'Em Andamento'));
                const event = todayShift ? events.find(e => e.id === todayShift.eventId) : null;

                if (!todayShift) {
                  return (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                      <p style={{ fontSize: '1.5rem' }}>📭</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Você não tem escalas ativas agendadas para hoje.</p>
                      <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Navegue pela aba de Oportunidades para se candidatar!</p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ borderLeft: '4px solid var(--color-green)', paddingLeft: '12px' }}>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{event ? event.name : 'Show'}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        📍 {event ? event.location : 'Local'} • Data: {todayShift.date}
                      </span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <p style={{ margin: 0 }}><strong>Horas Planejadas:</strong> {todayShift.scheduledHours}h</p>
                      <p style={{ margin: 0 }}><strong>Taxa de Cachê:</strong> R$ {(todayShift.hourlyRate * todayShift.scheduledHours).toFixed(2)} (R$ {todayShift.hourlyRate.toFixed(2)}/h)</p>
                      {todayShift.checkInTime && <p style={{ margin: 0 }}><strong>Check-In efetuado:</strong> {todayShift.checkInTime}</p>}
                      <p style={{ margin: 0 }}><strong>Status Ponto:</strong> <span style={{ fontWeight: 700, color: 'var(--color-green)' }}>{todayShift.status}</span></p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {todayShift.status === 'Agendado' && (
                        <button 
                          onClick={() => {
                            const eventName = event ? event.name : 'Show';
                            const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            alert(`Check-in de Entrada Realizado com Sucesso via GPS corporativo no local: ${event?.location} às ${timeNow}`);
                            shifts.find(s => s.id === todayShift.id).status = 'Em Andamento';
                            shifts.find(s => s.id === todayShift.id).checkInTime = timeNow;
                            // Force state reload
                            setShifts([...shifts]);
                          }}
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '12px', fontSize: '0.85rem' }}
                        >
                          📍 Confirmar Check-In Entrada
                        </button>
                      )}

                      {todayShift.status === 'Em Andamento' && (
                        <button 
                          onClick={() => {
                            const hours = prompt("Confirme as horas efetivas de palco trabalhadas hoje:", todayShift.scheduledHours);
                            if (hours !== null) {
                              const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                              alert(`Check-out realizado às ${timeNow}. Horas registradas: ${hours}h. Aguardando liberação do produtor.`);
                              const target = shifts.find(s => s.id === todayShift.id);
                              target.status = parseFloat(hours) !== todayShift.scheduledHours ? 'Disputado' : 'Finalizado';
                              target.actualHours = parseFloat(hours);
                              target.checkOutTime = timeNow;
                              if (parseFloat(hours) !== todayShift.scheduledHours) {
                                target.disputeNotes = `Divergência de horas: Declarado ${hours}h contra ${todayShift.scheduledHours}h planejadas.`;
                              }
                              setShifts([...shifts]);
                            }
                          }}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '12px', fontSize: '0.85rem', backgroundColor: '#e2e8f0', color: '#1e293b' }}
                        >
                          ⏹ Confirmar Saída / Registrar Ponto
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Groups / Bands */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>
                🎸 Meus Grupos / Bandas
              </h3>
              
              {groups.filter(g => g.members?.includes(currentUser?.id) || g.leader_id === currentUser?.id).length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Você ainda não faz parte de nenhuma equipe ou banda musical.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {groups.filter(g => g.members?.includes(currentUser?.id) || g.leader_id === currentUser?.id).map(g => (
                    <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>{g.name}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Categoria: {g.category}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#e2f0fd', color: '#0284c7', padding: '2px 8px', borderRadius: '100px' }}>
                        {g.members?.length || 1} membros
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Account profile settings */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>
                ⚙ Minhas Informações Cadastrais
              </h3>
              <button 
                onClick={() => {
                  const shareUrl = `${window.location.origin}?talent=${currentUser?.id}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert(`✓ Link de compartilhamento do seu card copiado para área de transferência:\n${shareUrl}`);
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.7rem' }}
              >
                🔗 Compartilhar Card
              </button>
            </div>

            {/* Profile editor form */}
            {renderProfileForm()}
          </div>

        </div>
      )}


      {/* 8. MARKETPLACE & VENDAS TAB */}
      {dashboardTab === 'marketplace' && (currentUser?.cnpj || currentUser?.registrationType === 'PJ') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>
              🛒 Integração de Marketplace & Vendas por API
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Como fornecedor corporativo (PJ/CNPJ), você pode exibir e gerenciar suas vendas de produtos integradas diretamente em seu cartão compartilhado do GIG BR.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>Status da API de Catálogo</h4>
                <p style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, margin: 0 }}>
                  ● {currentUser?.marketplace_url ? 'CONECTADO E ATIVO' : 'AGUARDANDO INTEGRAÇÃO'}
                </p>
                {currentUser?.marketplace_url && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '6px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {currentUser.marketplace_url}
                  </span>
                )}
              </div>
              <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>Visualizações do Catálogo</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-blue)', margin: 0 }}>
                  1.240 cliques
                </p>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '4px' }}>Cliques no botão "Marketplace" do seu card.</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px' }}>📦 Catálogo de Vendas Externo (Simulação)</h4>
              {currentUser?.marketplace_url ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.8rem', color: '#1e3a8a' }}>
                    💡 Exibindo produtos integrados a partir do endereço configurado: <strong>{currentUser.marketplace_url}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginTop: '10px' }}>
                    {[
                      { name: 'Console Digital de Som 32ch', price: 'R$ 14.500,00', stock: '2 unid' },
                      { name: 'Cabo XLR Profissional 10m', price: 'R$ 89,90', stock: '15 unid' },
                      { name: 'Microfone Dinâmico Supercardioide', price: 'R$ 650,00', stock: '8 unid' },
                      { name: 'Case Rígido para Cabos', price: 'R$ 420,00', stock: '5 unid' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', backgroundColor: '#ffffff', textAlign: 'center' }}>
                        <div style={{ width: '100%', height: '80px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', borderRadius: '4px', marginBottom: '8px' }}>
                          📦
                        </div>
                        <strong style={{ display: 'block', fontSize: '0.8rem', height: '36px', overflow: 'hidden' }}>{item.name}</strong>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: '#2563eb', fontWeight: 800, margin: '6px 0' }}>{item.price}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Estoque: {item.stock}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                  <span style={{ fontSize: '2rem' }}>🔌</span>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '8px 0 4px 0' }}>Nenhum Catálogo Conectado</h5>
                  <p style={{ fontSize: '0.75rem', maxWidth: '380px', margin: '0 auto 12px auto' }}>Vá em "Meu Dashboard" e cadastre o link do seu Catálogo de Vendas ou link do MercadoLivre/Loja para integrar seus produtos.</p>
                  <button onClick={() => setDashboardTab('freelancer_dash')} className="btn btn-secondary btn-sm">Configurar Link</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Direct email proposal modal */}
      {proposingContractor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel card-glow" style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            color: 'var(--text-main)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)' }}>📧 Enviar Proposta por E-mail</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Envie termos de trabalho diretamente para o endereço cadastrado do profissional: <br/>
                <strong style={{ color: 'var(--color-blue)' }}>{proposingContractor.email}</strong>
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const cache = form.elements.proposalCache.value;
              const date = form.elements.proposalDate.value;
              const message = form.elements.proposalMessage.value;
              
              const targetEmail = proposingContractor.email || `${proposingContractor.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
              const emailSubject = `Nova Proposta de GIG - de ${currentUser?.name || 'Contratante GIG BR'}`;
              const emailBody = `Olá ${proposingContractor.name},\n\n` +
                                `Você recebeu uma proposta de gig através da plataforma GIG BR:\n` +
                                `Remetente: ${currentUser?.name || 'Contratante'} (${currentUser?.email || 'sistema@gigbr.com.br'})\n` +
                                `Cachê Oferecido: R$ ${parseFloat(cache).toFixed(2)}\n` +
                                `Data Proposta: ${date || 'A definir'}\n\n` +
                                `Mensagem:\n` +
                                `"${message}"\n\n` +
                                `Acesse o dashboard no GIG BR para confirmar e responder a esta proposta.`;

              try {
                await fetch(`${apiOrigin}/api/emails/send`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sender: currentUser?.email || 'sistema@gigbr.com.br',
                    recipient: targetEmail,
                    subject: emailSubject,
                    body: emailBody
                  })
                });
              } catch (err) {
                console.warn("Failed to dispatch email via API, falling back to local simulation logs.");
              }

              alert(
                `📩 Proposta enviada com sucesso!\n\n` +
                `Uma solicitação de contato foi enviada para:\n` +
                `📧 ${targetEmail}\n\n` +
                `Detalhes:\n` +
                `- Cachê Proposto: R$ ${parseFloat(cache).toFixed(2)}\n` +
                `- Data Prevista: ${date || 'A definir'}\n` +
                `- Mensagem: "${message}"`
              );
              setProposingContractor(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cachê Oferecido (R$)</label>
                  <input 
                    type="number" 
                    name="proposalCache"
                    className="form-input" 
                    placeholder="ex: 500" 
                    required
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Data da Apresentação</label>
                  <input 
                    type="date" 
                    name="proposalDate"
                    className="form-input" 
                    required
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Mensagem de Trabalho</label>
                <textarea 
                  name="proposalMessage"
                  className="form-input" 
                  rows="4" 
                  placeholder="Descreva o local da apresentação, horários de montagem, equipe de palco envolvida e informações de transporte..."
                  required
                  style={{ fontSize: '0.8rem', resize: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button 
                  type="button"
                  onClick={() => setProposingContractor(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Enviar Proposta
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {(userRole === 'admin' || userRole === 'employer' || userRole === 'freelancer' || !userRole) && (
          <button 
            onClick={() => setDashboardTab('talentos')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: dashboardTab === 'talentos' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔍</span>
            <span>Talentos</span>
          </button>
        )}
        
        <button 
          onClick={() => setDashboardTab('vagas')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.65rem',
            fontWeight: 600,
            color: dashboardTab === 'vagas' ? 'var(--color-green)' : 'var(--text-secondary)',
            cursor: 'pointer',
            gap: '4px'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>💼</span>
          <span>Vagas</span>
        </button>

        {(userRole === 'admin' || userRole === 'employer' || !userRole) && (
          <button 
            onClick={() => setDashboardTab('cadastro')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: dashboardTab === 'cadastro' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📝</span>
            <span>Cadastros</span>
          </button>
        )}

        {(userRole === 'admin' || userRole === 'employer' || userRole === 'freelancer' || !userRole) && (
          <button 
            onClick={() => setDashboardTab('financeiro')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: dashboardTab === 'financeiro' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>💰</span>
            <span>Financeiro</span>
          </button>
        )}

        {userRole === 'admin' && (
          <button 
            onClick={() => setDashboardTab('admin')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: dashboardTab === 'admin' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔧</span>
            <span>Admin</span>
          </button>
        )}

        {currentUser && (
          <button 
            onClick={() => setDashboardTab('freelancer_dash')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: dashboardTab === 'freelancer_dash' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>👤</span>
            <span>Meu Dashboard</span>
          </button>
        )}
      </div>

      {/* Admin User Edit Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px', width: '100%', backgroundColor: '#ffffff', padding: '24px',
            borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px',
            color: 'var(--text-main)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>🔧 Editar Usuário (Admin)</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updateUserAdmin(editingUser.id, editingUser);
              setEditingUser(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome Completo</label>
                <input 
                  type="text" className="form-input" required
                  value={editingUser.name || ''}
                  onChange={(evt) => setEditingUser({ ...editingUser, name: evt.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>E-mail</label>
                <input 
                  type="email" className="form-input" required
                  value={editingUser.email || ''}
                  onChange={(evt) => setEditingUser({ ...editingUser, email: evt.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Telefone</label>
                <input 
                  type="text" className="form-input"
                  value={editingUser.phone || ''}
                  onChange={(evt) => setEditingUser({ ...editingUser, phone: evt.target.value })}
                />
              </div>

              {!editingUser.isEmployer && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Categoria</label>
                    <select 
                      className="form-input"
                      value={editingUser.category || 'Músicos'}
                      onChange={(evt) => setEditingUser({ ...editingUser, category: evt.target.value })}
                    >
                      <option value="Músicos">Músicos</option>
                      <option value="Roadies">Roadies</option>
                      <option value="Técnicos">Técnicos</option>
                      <option value="Artistas">Artistas</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Registro OMB/DRT</label>
                    <input 
                      type="text" className="form-input"
                      placeholder="OMB ou DRT"
                      value={editingUser.omb || editingUser.drt || ''}
                      onChange={(evt) => setEditingUser({ ...editingUser, omb: evt.target.value, drt: evt.target.value })}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Cidade</label>
                  <input 
                    type="text" className="form-input" required
                    value={editingUser.city || ''}
                    onChange={(evt) => setEditingUser({ ...editingUser, city: evt.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>UF</label>
                  <select 
                    className="form-input"
                    value={editingUser.state || 'SP'}
                    onChange={(evt) => setEditingUser({ ...editingUser, state: evt.target.value })}
                  >
                    {BRAZILIAN_STATES.map(st => <option key={st.code} value={st.code}>{st.code}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nível de Acesso (Permissão)</label>
                  <select 
                    className="form-input"
                    value={editingUser.role || 'freelancer'}
                    onChange={(evt) => setEditingUser({ ...editingUser, role: evt.target.value })}
                  >
                    <option value="freelancer">Prestador (Freelancer)</option>
                    <option value="employer">Contratante (Produtor)</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Homologação</label>
                  <select 
                    className="form-input"
                    value={editingUser.is_vetted ? "1" : "0"}
                    onChange={(evt) => setEditingUser({ ...editingUser, is_vetted: parseInt(evt.target.value) })}
                  >
                    <option value="1">Homologado (Ativo)</option>
                    <option value="0">Pendente (Inativo)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Tipo PIX</label>
                  <select 
                    className="form-input"
                    value={editingUser.pixType || 'CPF'}
                    onChange={(evt) => setEditingUser({ ...editingUser, pixType: evt.target.value })}
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="Email">E-mail</option>
                    <option value="Telefone">Celular</option>
                    <option value="Chave Aleatoria">Chave Aleatória</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Chave PIX</label>
                  <input 
                    type="text" className="form-input"
                    value={editingUser.pixKey || ''}
                    onChange={(evt) => setEditingUser({ ...editingUser, pixKey: evt.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Apresentação / Bio</label>
                <textarea 
                  className="form-input" rows="3" maxLength="250"
                  value={editingUser.bio || ''}
                  onChange={(evt) => setEditingUser({ ...editingUser, bio: evt.target.value })}
                  style={{ fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Foto de Perfil (Avatar)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editingUser.avatar && (
                    <img src={editingUser.avatar} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <input 
                    type="file" accept="image/*"
                    onChange={(evt) => {
                      const file = evt.target.files[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert("A foto de perfil deve ter no máximo 2MB!");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditingUser({ ...editingUser, avatar: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ fontSize: '0.75rem', flex: 1 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>URL do Marketplace</label>
                <input 
                  type="url" className="form-input"
                  value={editingUser.marketplace_url || editingUser.marketplaceUrl || ''}
                  onChange={(evt) => setEditingUser({ ...editingUser, marketplace_url: evt.target.value })}
                  placeholder="Link do catálogo de vendas externo"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Site / Perfil Social / Link Externo</label>
                <input 
                  type="url" className="form-input"
                  value={editingUser.website_url || editingUser.websiteUrl || ''}
                  onChange={(evt) => setEditingUser({ ...editingUser, website_url: evt.target.value })}
                  placeholder="https://instagram.com/perfil ou site oficial"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Group Edit Modal */}
      {editingGroup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px', width: '100%', backgroundColor: '#ffffff', padding: '24px',
            borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px',
            color: 'var(--text-main)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>🔧 Editar Grupo / Banda (Admin)</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updateGroupAdmin(editingGroup.id, editingGroup);
              setEditingGroup(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome do Grupo</label>
                <input 
                  type="text" className="form-input" required
                  value={editingGroup.name || ''}
                  onChange={(evt) => setEditingGroup({ ...editingGroup, name: evt.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>E-mail de Contato (Obrigatório)</label>
                <input 
                  type="email" className="form-input" required
                  value={editingGroup.email || ''}
                  onChange={(evt) => setEditingGroup({ ...editingGroup, email: evt.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Categoria</label>
                  <select 
                    className="form-input"
                    value={editingGroup.category || 'Músicos'}
                    onChange={(evt) => setEditingGroup({ ...editingGroup, category: evt.target.value })}
                  >
                    <option value="Músicos">Músicos</option>
                    <option value="Roadies">Roadies</option>
                    <option value="Técnicos">Técnicos</option>
                    <option value="Artistas">Artistas</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Cidade</label>
                  <input 
                    type="text" className="form-input" required
                    value={editingGroup.city || ''}
                    onChange={(evt) => setEditingGroup({ ...editingGroup, city: evt.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Foto de Perfil (Avatar)</label>
                <input 
                  type="file" accept="image/*"
                  onChange={(evt) => {
                    const file = evt.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("A foto do grupo deve ter no máximo 2MB!");
                        evt.target.value = "";
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingGroup({ ...editingGroup, avatar: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ fontSize: '0.75rem', width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Apresentação / Descrição</label>
                <textarea 
                  className="form-input" rows="3"
                  value={editingGroup.description || ''}
                  onChange={(evt) => setEditingGroup({ ...editingGroup, description: evt.target.value })}
                  style={{ fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingGroup(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Opportunity Edit Modal */}
      {editingOpportunity && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px', width: '100%', backgroundColor: '#ffffff', padding: '24px',
            borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px',
            color: 'var(--text-main)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>🔧 Editar Vaga / Oportunidade (Admin)</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updateOpportunityAdmin(editingOpportunity.id, editingOpportunity);
              setEditingOpportunity(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Título da Vaga</label>
                <input 
                  type="text" className="form-input" required
                  value={editingOpportunity.title || ''}
                  onChange={(evt) => setEditingOpportunity({ ...editingOpportunity, title: evt.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Categoria</label>
                  <select 
                    className="form-input"
                    value={editingOpportunity.category || 'Músicos'}
                    onChange={(evt) => setEditingOpportunity({ ...editingOpportunity, category: evt.target.value })}
                  >
                    <option value="Músicos">Músicos</option>
                    <option value="Roadies">Roadies</option>
                    <option value="Técnicos">Técnicos</option>
                    <option value="Artistas">Artistas</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Cachê Oferecido (R$)</label>
                  <input 
                    type="text" className="form-input" required
                    value={editingOpportunity.payment || ''}
                    onChange={(evt) => setEditingOpportunity({ ...editingOpportunity, payment: evt.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Data</label>
                  <input 
                    type="date" className="form-input" required
                    value={editingOpportunity.date || ''}
                    onChange={(evt) => setEditingOpportunity({ ...editingOpportunity, date: evt.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Localidade</label>
                  <input 
                    type="text" className="form-input" required
                    value={editingOpportunity.location || ''}
                    onChange={(evt) => setEditingOpportunity({ ...editingOpportunity, location: evt.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Descrição Detalhada</label>
                <textarea 
                  className="form-input" rows="3"
                  value={editingOpportunity.description || ''}
                  onChange={(evt) => setEditingOpportunity({ ...editingOpportunity, description: evt.target.value })}
                  style={{ fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingOpportunity(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Guest Freelancer Registration Modal */}
      {showGuestRegisterModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px', width: '100%', backgroundColor: '#ffffff', padding: '24px',
            borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px',
            color: 'var(--text-main)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>📝 Cadastrar Perfil Profissional</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Preencha seus dados para completar sua candidatura à vaga <strong>{guestTargetJob?.title}</strong>.
              </p>
            </div>

            {guestError && (
              <div style={{
                backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#991b1b',
                padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600
              }}>
                ⚠️ {guestError}
              </div>
            )}

            <form onSubmit={handleGuestRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Tipo de Registro</label>
                  <select 
                    className="form-input"
                    value={guestForm.registrationType}
                    onChange={(evt) => setGuestForm({ ...guestForm, registrationType: evt.target.value })}
                  >
                    <option value="PF">Pessoa Física (CPF)</option>
                    <option value="PJ">Pessoa Jurídica (MEI/CNPJ)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {guestForm.registrationType === 'PF' ? 'CPF' : 'CNPJ'}
                  </label>
                  <input 
                    type="text" className="form-input" required
                    placeholder={guestForm.registrationType === 'PF' ? '123.456.789-00' : '00.000.000/0001-00'}
                    value={guestForm.cpf}
                    onChange={(evt) => setGuestForm({ ...guestForm, cpf: evt.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome Completo / Razão Social</label>
                <input 
                  type="text" className="form-input" required
                  placeholder="Seu nome profissional"
                  value={guestForm.name}
                  onChange={(evt) => setGuestForm({ ...guestForm, name: evt.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>E-mail de Contato</label>
                  <input 
                    type="email" className="form-input" required
                    placeholder="email@exemplo.com"
                    value={guestForm.email}
                    onChange={(evt) => setGuestForm({ ...guestForm, email: evt.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Telefone</label>
                  <input 
                    type="text" className="form-input" required
                    placeholder="(11) 98888-7777"
                    value={guestForm.phone}
                    onChange={(evt) => setGuestForm({ ...guestForm, phone: evt.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Registro DRT (Opcional)</label>
                  <input 
                    type="text" className="form-input"
                    placeholder="DRT-XXXX"
                    value={guestForm.drt}
                    onChange={(evt) => setGuestForm({ ...guestForm, drt: evt.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Registro OMB (Opcional)</label>
                  <input 
                    type="text" className="form-input"
                    placeholder="OMB-XXXX"
                    value={guestForm.omb}
                    onChange={(evt) => setGuestForm({ ...guestForm, omb: evt.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Foto de Perfil (Max 2MB)</label>
                <input 
                  type="file" accept="image/*"
                  onChange={(evt) => {
                    const file = evt.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("A foto do perfil deve ter no máximo 2MB!");
                        evt.target.value = "";
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setGuestForm({ ...guestForm, avatar: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ fontSize: '0.75rem', width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Biografia / Apresentação</label>
                <textarea 
                  className="form-input" rows="3"
                  placeholder="Conte um pouco sobre sua carreira artística e técnica..."
                  value={guestForm.bio}
                  onChange={(evt) => setGuestForm({ ...guestForm, bio: evt.target.value })}
                  style={{ fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => { setShowGuestRegisterModal(false); setGuestTargetJob(null); }} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Homologar Cadastro</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Event Modal */}
      {showEditEventModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '460px', width: '100%', backgroundColor: '#ffffff', padding: '24px',
            borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px',
            color: 'var(--text-main)'
          }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>✏️ Editar Informações do Show</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Altere os limites financeiros ou informações básicas do evento.
              </p>
            </div>

            <form onSubmit={handleEventEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome do Show / Evento</label>
                <input 
                  type="text" className="form-input" required
                  value={editEventForm.name}
                  onChange={(e) => setEditEventForm({ ...editEventForm, name: e.target.value })}
                  style={{ backgroundColor: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Data</label>
                  <input 
                    type="date" className="form-input" required
                    value={editEventForm.date}
                    onChange={(e) => setEditEventForm({ ...editEventForm, date: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Local</label>
                  <input 
                    type="text" className="form-input" required
                    value={editEventForm.location}
                    onChange={(e) => setEditEventForm({ ...editEventForm, location: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Limite de Orçamento (R$)</label>
                  <input 
                    type="number" className="form-input" required
                    value={editEventForm.budgetLimit}
                    onChange={(e) => setEditEventForm({ ...editEventForm, budgetLimit: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Meta Crowdfunding (R$)</label>
                  <input 
                    type="number" className="form-input" required
                    value={editEventForm.crowdfundGoal}
                    onChange={(e) => setEditEventForm({ ...editEventForm, crowdfundGoal: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Chave PIX da Campanha</label>
                <input 
                  type="text" className="form-input" required
                  value={editEventForm.pixKey}
                  onChange={(e) => setEditEventForm({ ...editEventForm, pixKey: e.target.value })}
                  style={{ backgroundColor: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEditEventModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DesktopDashboard;
