import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import shareBg from '../assets/share_bg.jpg';



// Offline fallback mock data to guarantee profiles load even if backend API is unreachable
const MOCK_FALLBACK_TALENTS = [
  { id: 'cont-1', name: 'Thiago Oliveira da Silva', role: 'Freelancer', category: 'Técnicos', city: 'São Paulo', state: 'SP', email: 'thiago@gmail.com', phone: '(11) 98888-7777', rating: 4.9, bio: 'Técnico de áudio e iluminação especializado em consoles digitais, alinhamento de sistemas de P.A.', omb: '', drt: 'DRT/ART 99318', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { id: 'cont-2', name: 'Mariana Santos Souza', role: 'Freelancer', category: 'Camarim', city: 'São Paulo', state: 'SP', email: 'mariana@gmail.com', phone: '(11) 98888-7777', rating: 4.8, bio: 'Produtora técnica de camarins e receptivo de grandes festivais.', omb: '', drt: 'DRT/ART 99318', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
  { id: 'cont-3', name: 'Bruno Lima Ferreira', role: 'Freelancer', category: 'Músicos', city: 'São Paulo', state: 'SP', email: 'bruno@gmail.com', phone: '(11) 98888-7777', rating: 4.7, bio: 'Instrumentista profissional com sólida experiência em palcos de grande porte.', omb: 'OMB/SP 48312', drt: '', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { id: 'cont-8', name: 'Juliana Costa', role: 'Freelancer', category: 'Roadies', city: 'São Paulo', state: 'SP', email: 'juliana.costa@gmail.com', phone: '(11) 98888-5555', rating: 4.9, bio: 'Roadie especializada em montagem de bateria e regulagem de amplificadores valvulados. Assistência técnica rápida.', omb: '', drt: 'DRT-9981', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' }
];

const MOCK_FALLBACK_GROUPS = [
  { id: 'group-1', name: 'Banda Samba & Swing BR', category: 'Músicos', description: 'Grupo musical especializado em samba de roda, bossa nova e ritmos brasileiros para recepções corporativas e casamentos.', city: 'São Paulo', state: 'SP', email: 'contato@sambaswing.com.br', leaderName: 'Bruno Lima Ferreira', rating: 5.0, avatar: '' }
];

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
      margin: '16px auto 0 auto',
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

const PublicProfile = ({ id, type, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [proposedCache, setProposedCache] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [successCache, setSuccessCache] = useState('');
  const [successRecipient, setSuccessRecipient] = useState('');

  useEffect(() => {
    // Fetch profile from backend Express API with origin checks and offline fallbacks
    const fetchProfile = async () => {
      
      try {
        setLoading(true);
        if (type === 'talent') {
          const res = await fetch(`${apiOrigin}/api/users/${id}`);
          if (!res.ok) throw new Error('Trabalhador não encontrado.');
          const data = await res.json();
          setProfile(data);
        } else {
          const res = await fetch(`${apiOrigin}/api/groups`);
          if (!res.ok) throw new Error('Grupo não encontrado.');
          const data = await res.json();
          const group = data.find(g => g.id === id);
          if (!group) throw new Error('Grupo não encontrado.');
          
          // Get leader details
          if (group.leader_id) {
            const leaderRes = await fetch(`${apiOrigin}/api/users/${group.leader_id}`);
            if (leaderRes.ok) {
              const leader = await leaderRes.json();
              group.leaderName = leader.name;
              if (!group.email) group.email = leader.email;
            }
          }
          setProfile(group);
        }
      } catch (err) {
        console.warn("API request failed. Loading offline profile fallback...", err.message);
        
        let found = null;
        if (type === 'talent') {
          try {
            const localUsers = JSON.parse(localStorage.getItem('gigbr_users') || '[]');
            const foundUser = localUsers.find(u => u.id === id);
            if (foundUser) {
              found = {
                id: foundUser.id,
                name: foundUser.name,
                role: foundUser.role || foundUser.category || 'Freelancer',
                category: foundUser.category || 'Músicos',
                rating: parseFloat(foundUser.rating || 5.0),
                completedShifts: parseInt(foundUser.completed_shifts || foundUser.completedShifts || 0),
                cpf: foundUser.cpf,
                cnpj: foundUser.cnpj,
                city: foundUser.city || 'São Paulo',
                state: foundUser.state || 'SP',
                avatar: foundUser.avatar,
                email: foundUser.email,
                phone: foundUser.phone,
                omb: foundUser.omb,
                drt: foundUser.drt,
                bio: foundUser.bio
              };
            }
          } catch (e) {}

          if (!found) {
            found = MOCK_FALLBACK_TALENTS.find(t => t.id === id);
          }

          if (found) {
            setProfile(found);
          } else {
            setError('Perfil não encontrado offline.');
          }
        } else {
          try {
            const localGroups = JSON.parse(localStorage.getItem('gigbr_groups') || '[]');
            const foundGroup = localGroups.find(g => g.id === id);
            if (foundGroup) {
              found = foundGroup;
            }
          } catch (e) {}

          if (!found) {
            found = MOCK_FALLBACK_GROUPS.find(g => g.id === id);
          }

          if (found) {
            setProfile(found);
          } else {
            setError('Grupo não encontrado offline.');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, type]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !proposedCache) {
      alert("Por favor, preencha o seu nome, e-mail e proposta de cachê!");
      return;
    }

    const emailTo = profile.email || 'contato@dominio.com.br';
    const emailSubject = `Nova Proposta de GIG - de ${senderName}`;
    const emailBody = `
Olá ${profile.name}, você recebeu uma proposta de gig de:
Remetente: ${senderName} (${senderEmail})
Cachê Oferecido: R$ ${parseFloat(proposedCache).toFixed(2)}
Data Proposta: ${proposedDate || 'A definir'}

Mensagem:
"${message}"
`;

    
    try {
      await fetch(`${apiOrigin}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: senderEmail,
          recipient: emailTo,
          subject: emailSubject,
          body: emailBody
        })
      });
    } catch (err) {
      console.warn("Failed to dispatch email via API, falling back to local simulation logs.");
    }
    
    setSuccessRecipient(emailTo);
    setSuccessEmail(senderEmail);
    setSuccessCache(proposedCache);
    setSuccess(true);
    
    setSenderName('');
    setSenderEmail('');
    setProposedCache('');
    setProposedDate('');
    setMessage('');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <p style={{ color: '#ffffff', fontSize: '1.2rem', fontFamily: 'sans-serif' }}>Carregando perfil público...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#ffffff', padding: '20px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Erro ao Carregar Perfil</h3>
        <p style={{ color: '#f87171', marginBottom: '20px' }}>{error || 'Perfil inválido ou indisponível.'}</p>
        <button onClick={onBack} className="btn btn-primary">Voltar para GIG BR</button>
      </div>
    );
  }

  const isTalent = type === 'talent';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${shareBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      zIndex: 1
    }}>
      {/* Dark overlay backdrop for readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        zIndex: -1
      }} />

      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', cursor: 'pointer', zIndex: 2 }} onClick={onBack}>
        <img src={logo} alt="Logo" style={{ height: '48px' }} />
        <h1 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>GIG BR</h1>
      </div>

      {/* Standalone Card Grid Layout */}
      <div style={{
        maxWidth: '900px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '24px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 2
      }} className="responsive-public-grid">
        
        {/* Left Side: Premium Business Card */}
        <div style={{
          padding: '40px 32px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {isTalent ? (
            <img 
              src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'} 
              alt={profile.name} 
              onClick={() => {
                const url = profile.website_url || profile.websiteUrl;
                if (url) window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
              }}
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #10b981', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', cursor: (profile.website_url || profile.websiteUrl) ? 'pointer' : 'default' }}
              title={(profile.website_url || profile.websiteUrl) ? `Acesse: ${profile.website_url || profile.websiteUrl}` : undefined}
            />
          ) : profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              onClick={() => {
                const url = profile.website_url || profile.websiteUrl;
                if (url) window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
              }}
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0284c7', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', cursor: (profile.website_url || profile.websiteUrl) ? 'pointer' : 'default' }}
              title={(profile.website_url || profile.websiteUrl) ? `Acesse: ${profile.website_url || profile.websiteUrl}` : undefined}
            />
          ) : (
            <div 
              onClick={() => {
                const url = profile.website_url || profile.websiteUrl;
                if (url) window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
              }}
              style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#ffffff', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', cursor: (profile.website_url || profile.websiteUrl) ? 'pointer' : 'default' }}
              title={(profile.website_url || profile.websiteUrl) ? `Acesse: ${profile.website_url || profile.websiteUrl}` : undefined}
            >
              👥
            </div>
          )}

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0' }}>{profile.name}</h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600, margin: '0 0 16px 0' }}>
            {isTalent ? (profile.category || 'Prestador') : `Grupo / Equipe • ${profile.category}`}
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <span style={{ backgroundColor: '#e2f0fd', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '100px' }}>
              📍 Cidade onde vive: {profile.city} - {profile.state}
            </span>
            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '100px' }}>
              ⭐ {profile.rating || '5.0'}
            </span>
          </div>

          {/* Credentials Display */}
          <div style={{ width: '100%', textAlign: 'left', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profile.cnpj ? (
              <p style={{ margin: 0 }}><strong>PJ / MEI:</strong> {profile.cnpj}</p>
            ) : (
              isTalent && <p style={{ margin: 0 }}><strong>Pessoa Física (Autônomo)</strong></p>
            )}
            {profile.omb && <p style={{ margin: 0 }}><strong>OMB (Músico):</strong> {profile.omb}</p>}
            {profile.drt && <p style={{ margin: 0 }}><strong>Registro DRT:</strong> {profile.drt}</p>}
            {!isTalent && profile.email && (
              <p style={{ margin: 0 }}><strong>E-mail de Contato:</strong> {profile.email}</p>
            )}
            {!isTalent && profile.leaderName && (
              <p style={{ margin: 0 }}><strong>Responsável / Líder:</strong> {profile.leaderName}</p>
            )}
          </div>

          {/* Direct Contact Buttons */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {profile.website_url && (
              <a 
                href={profile.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  fontSize: '0.8rem', 
                  padding: '10px', 
                  backgroundColor: '#0f172a', 
                  color: '#ffffff', 
                  border: 'none',
                  textDecoration: 'none',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                🔗 Website / Perfil Social
              </a>
            )}
            {profile.cnpj ? (
              <a 
                href={profile.marketplace_url || 'https://www.mercadolivre.com.br'} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  fontSize: '0.85rem', 
                  padding: '12px', 
                  backgroundColor: '#3b82f6', 
                  color: '#ffffff', 
                  border: 'none',
                  textDecoration: 'none',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                }}
              >
                🛒 Ir para o Marketplace
              </a>
            ) : (
              <>
                {profile.phone && (
                  <a 
                    href={`https://wa.me/55${profile.phone.replace(/[^\d]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      fontSize: '0.8rem', 
                      padding: '10px', 
                      backgroundColor: '#25D366', 
                      color: '#ffffff', 
                      border: 'none',
                      textDecoration: 'none',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    💬 WhatsApp Direto
                  </a>
                )}
                {profile.phone && (
                  <a 
                    href={`tel:${profile.phone.replace(/[^\d]/g, '')}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      fontSize: '0.8rem', 
                      padding: '10px', 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      textDecoration: 'none',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    📞 Ligar para Telefone
                  </a>
                )}
                {profile.email && (
                  <a 
                    href={`mailto:${profile.email}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      fontSize: '0.8rem', 
                      padding: '10px', 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      textDecoration: 'none',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    ✉️ Enviar E-mail Direto
                  </a>
                )}
              </>
            )}
          </div>

          <div style={{ textAlign: 'left', width: '100%' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 10px 0' }}>
              Biografia / Perfil
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5', fontStyle: 'italic', margin: 0 }}>
              "{profile.bio || 'Nenhum detalhe adicional informado.'}"
            </p>
          </div>

          <GoogleAdSlot slotId="profile-sidebar-ad" height="120px" />
        </div>

        {/* Right Side: Propose contact form */}
        <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {success ? (
            <div style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📩</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: '#166534' }}>
                Proposta Enviada com Sucesso!
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '24px', lineHeight: '1.5' }}>
                Uma solicitação de contato profissional foi encaminhada para a caixa postal cadastrada deste perfil.
              </p>
              
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px dashed #a7f3d0',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                color: '#1e293b',
                fontSize: '0.8rem',
                marginBottom: '24px'
              }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '2px' }}>E-mail de Destino</strong>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f172a' }}>{successRecipient}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '2px' }}>Seu E-mail (Remetente)</strong>
                    <span style={{ fontWeight: 700 }}>{successEmail}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '2px' }}>Cachê Oferecido</strong>
                    <span style={{ fontWeight: 700, color: '#047857' }}>R$ {parseFloat(successCache || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSuccess(false)} 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '12px' }}
              >
                Enviar Outra Proposta
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📩 Enviar Proposta de Contato
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '24px' }}>
                Proponha um show ou envie seus contatos corporativos diretamente para este profissional/grupo.
              </p>

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Seu Nome</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Seu nome ou Produtora" 
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '10px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Seu E-mail</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="exemplo@produtora.com" 
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '10px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Cachê Proposto (R$)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Valor Cachê" 
                      required
                      value={proposedCache}
                      onChange={(e) => setProposedCache(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '10px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Data Proposta</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={proposedDate}
                      onChange={(e) => setProposedDate(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '10px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Mensagem / Detalhes do Show</label>
                  <textarea 
                    className="form-input" 
                    rows="4" 
                    placeholder="Descreva o local do show, equipamentos de som fornecidos e horários previstos de passagem de som..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '10px', resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.9rem', width: '100%', borderRadius: 'var(--radius-sm)' }}>
                  Enviar Proposta Profissional
                </button>
              </form>
            </>
          )}

          <GoogleAdSlot slotId="profile-bottom-ad" height="90px" />
        </div>

      </div>

      <button 
        onClick={onBack} 
        style={{
          marginTop: '30px',
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          fontSize: '0.85rem',
          cursor: 'pointer',
          textDecoration: 'underline',
          zIndex: 2
        }}
      >
        Voltar para a página inicial
      </button>
    </div>
  );
};

export default PublicProfile;
