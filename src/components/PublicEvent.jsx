import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import newsletterBg from '../assets/newsletter_bg.jpg';
import shareBg from '../assets/share_bg.jpg';

export default function PublicEvent({ id, onBack }) {
  const { showToast, events } = useContext(AppContext);
  const [subscribed, setSubscribed] = useState(() => {
    return localStorage.getItem('gigbr_newsletter_subscribed') === 'true';
  });
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Newsletter Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Músicos');
  const [submitting, setSubmitting] = useState(false);

  // PIX Modal States
  const [showPixModal, setShowPixModal] = useState(false);
  const [supportAmount, setSupportAmount] = useState('50');
  const [pixConfirmed, setPixConfirmed] = useState(false);

  const apiOrigin = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost/event-uk-brazil/public' : '';

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`${apiOrigin}/api/events/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar detalhes do evento.");
        const data = await res.json();
        if (!data || !data.id) {
          setError("Evento não localizado ou inativo.");
        } else {
          setEvent(data);
        }
      } catch (err) {
        // Fallback to local state if offline
        const localEvt = events.find(e => e.id === id);
        if (localEvt) {
          setEvent(localEvt);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, apiOrigin, events]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('gigbr_newsletter_subscribed', 'true');
      setSubscribed(true);
      setSubmitting(false);
    }, 1000);
  };

  const handleSupportPix = (e) => {
    e.preventDefault();
    const amount = parseFloat(supportAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Por favor, informe um valor válido.", "error");
      return;
    }
    setShowPixModal(true);
  };

  const confirmPixContribution = async () => {
    try {
      const currentRaised = Number(event.crowdfundRaised || event.crowdfund_raised || 0);
      const newRaised = currentRaised + parseFloat(supportAmount);
      
      const updatedEvt = {
        ...event,
        crowdfundRaised: newRaised,
        crowdfund_raised: newRaised
      };

      // Put to API
      await fetch(`${apiOrigin}/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvt)
      });

      setEvent(updatedEvt);
      setPixConfirmed(true);
      showToast(`⚡ Apoio virtual de R$ ${parseFloat(supportAmount).toFixed(2)} agendado com sucesso!`, "success");
    } catch (err) {
      showToast("Erro ao confirmar apoio PIX: " + err.message, "error");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#0f172a' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ border: '4px solid #cbd5e1', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Carregando dados do show...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <div className="glass-panel" style={{ maxWidth: '420px', width: '100%', backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #fee2e2' }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', margin: '12px 0 8px 0' }}>Erro ao Acessar Show</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>{error || "Show/Evento inválido ou inexistente."}</p>
          <button onClick={onBack} className="btn btn-secondary" style={{ width: '100%' }}>Voltar para o Início</button>
        </div>
      </div>
    );
  }

  // Render Newsletter Registration Screen if not subscribed
  if (!subscribed) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px', backgroundImage: `url(${newsletterBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '460px', width: '100%', backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', color: '#0f172a' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '2.5rem' }}>✉️</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', margin: '12px 0 6px 0', letterSpacing: '0.02em' }}>Newsletter GIG BR</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
              Inscreva-se na nossa newsletter para receber convites e novidades do mundo da música e fomento de eventos, e visualize os detalhes deste show!
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', color: '#475569' }}>Nome Completo</label>
              <input 
                type="text" required className="form-input" placeholder="Seu nome"
                value={name} onChange={e => setName(e.target.value)}
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', color: '#475569' }}>E-mail</label>
              <input 
                type="email" required className="form-input" placeholder="seu.email@provedor.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', color: '#475569' }}>Área de Interesse</label>
              <select 
                className="form-input" value={interest} onChange={e => setInterest(e.target.value)}
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              >
                <option value="Músicos">Músicos / Bandas</option>
                <option value="Eventos">Shows / Festivais</option>
                <option value="Staff">Roadies / Técnicos</option>
              </select>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '12px', fontSize: '0.85rem', width: '100%', marginTop: '8px' }}>
              {submitting ? 'Inscrevendo...' : 'Acessar Detalhes do Show'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Event Card View
  const raised = Number(event.crowdfundRaised || event.crowdfund_raised || 0);
  const goal = Number(event.crowdfundGoal || event.crowdfund_goal || 0);
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '20px', backgroundImage: `url(${shareBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="glass-panel" style={{ maxWidth: '560px', width: '100%', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.2)', color: '#0f172a' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #cbd5e1', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 900, backgroundColor: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '100px' }}>⚡ Show & Evento Coletivo</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '8px', marginBottom: '2px', color: '#1e293b' }}>{event.name}</h2>
            <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>📍 {event.location} • {event.state}</p>
          </div>
          <span style={{ fontSize: '2.5rem' }}>🎸</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          <div>
            <h4 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>Sobre o Show</h4>
            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5', margin: 0 }}>{event.description || "Nenhuma descrição detalhada fornecida."}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Data Prevista</span>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'A definir'}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Região de Atuação</span>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{event.location || 'São Paulo - SP'}</strong>
            </div>
          </div>

          {goal > 0 && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#166534' }}>Progresso da Meta PIX:</span>
                <strong style={{ color: '#15803d', fontSize: '0.85rem' }}>
                  R$ {raised.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / R$ {goal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#cbd5e1', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#22c55e', borderRadius: '100px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#166534', marginTop: '6px' }}>
                <span>🎯 {progress.toFixed(1)}% Arrecadado</span>
                <span>📅 Limite: {event.crowdfund_deadline || event.crowdfundDeadline || 'Não definido'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Support via PIX form */}
        <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '20px', textAlign: 'center' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', color: '#1e293b' }}>⚡ Fomento Rouanet Coletivo</h4>
          <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.4', marginBottom: '16px' }}>
            Participe do fomento coletivo deste show. O valor programado via PIX Virtual só será efetivado se a meta financeira estabelecida for batida.
          </p>

          <form onSubmit={handleSupportPix} style={{ display: 'flex', gap: '10px', maxWidth: '380px', margin: '0 auto' }}>
            <input 
              type="number" required min="1" className="form-input" placeholder="Valor de apoio R$ (ex. 50)"
              value={supportAmount} onChange={e => setSupportAmount(e.target.value)}
              style={{ flex: 1, backgroundColor: '#ffffff', borderColor: '#cbd5e1', padding: '10px', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', backgroundColor: '#22c55e', border: 'none', fontSize: '0.85rem', fontWeight: 700 }}>
              ⚡ Apoiar via PIX
            </button>
          </form>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
            ← Voltar para o Início GIG BR
          </button>
        </div>
      </div>

      {/* PIX Virtual Fomento Modal */}
      {showPixModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 12000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '440px', width: '100%', backgroundColor: '#ffffff', padding: '28px',
            borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px',
            textAlign: 'center', color: '#0f172a', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            {!pixConfirmed ? (
              <>
                <span style={{ fontSize: '2rem' }}>⚡</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>PIX Virtual de Fomento</h3>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                  Você está programando um apoio virtual de <strong>R$ {parseFloat(supportAmount).toFixed(2)}</strong> para o show <strong>{event.name}</strong>.
                </p>

                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '6px', fontSize: '0.75rem', color: '#b45309', textAlign: 'left', lineHeight: '1.4' }}>
                  <strong>ℹ️ Termos de Apoio:</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                    <li>O débito do PIX Virtual **só ocorre** se a meta de fomento for atingida.</li>
                    <li>Meta do show: R$ {(goal || 0).toLocaleString('pt-BR')}.</li>
                    <li>Se a meta não for batida até a data limite, nenhum valor será debitado.</li>
                  </ul>
                </div>

                {/* Simulated QR Code for support */}
                <div style={{ margin: '10px auto', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'inline-block' }}>
                  <div style={{ width: '140px', height: '140px', backgroundColor: '#1e293b', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', gap: '8px' }}>
                    <span style={{ fontSize: '1.8rem' }}>📱</span>
                    <span>QR CODE PIX</span>
                    <span>R$ {parseFloat(supportAmount).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowPixModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                  <button onClick={confirmPixContribution} className="btn btn-primary" style={{ flex: 1, backgroundColor: '#22c55e', border: 'none' }}>Confirmar PIX</button>
                </div>
              </>
            ) : (
              <>
                <span style={{ fontSize: '3rem' }}>🎉</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#15803d' }}>Apoio Confirmado!</h3>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                  Obrigado por incentivar a música autoral! Seu apoio PIX Virtual de <strong>R$ {parseFloat(supportAmount).toFixed(2)}</strong> foi programado com sucesso para o show <strong>{event.name}</strong>.
                </p>
                <button 
                  onClick={() => {
                    setShowPixModal(false);
                    setPixConfirmed(false);
                  }} 
                  className="btn btn-primary" 
                  style={{ width: '100%', backgroundColor: '#1e293b' }}
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
