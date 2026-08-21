import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function PublicOpportunity({ code, onBack }) {
  const { showToast } = useContext(AppContext);
  const [subscribed, setSubscribed] = useState(() => {
    return localStorage.getItem('gigbr_newsletter_subscribed') === 'true';
  });
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Newsletter Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Músicos');
  const [submitting, setSubmitting] = useState(false);

  const apiOrigin = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        const res = await fetch(`${apiOrigin}/api/opportunities?code=${code}`);
        if (!res.ok) throw new Error("Erro ao buscar detalhes da oportunidade.");
        const data = await res.json();
        if (!data || !data.id) {
          setError("Oportunidade não localizada ou código expirado.");
        } else {
          setOpportunity(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunity();
  }, [code, apiOrigin]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    // Simulate API registration to newsletter
    setTimeout(() => {
      localStorage.setItem('gigbr_newsletter_subscribed', 'true');
      setSubscribed(true);
      setSubmitting(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#0f172a' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ border: '4px solid #cbd5e1', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Carregando dados da vaga...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <div className="glass-panel" style={{ maxWidth: '420px', width: '100%', backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #fee2e2' }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', margin: '12px 0 8px 0' }}>Erro ao Acessar Vaga</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>{error || "Código de oportunidade inválido ou inativo."}</p>
          <button onClick={onBack} className="btn btn-secondary" style={{ width: '100%' }}>Voltar para o Início</button>
        </div>
      </div>
    );
  }

  // Render Newsletter Registration Screen
  if (!subscribed) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px', backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(219, 234, 254) 100%)' }}>
        <div className="glass-panel" style={{ maxWidth: '460px', width: '100%', backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', color: '#0f172a' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '2.5rem' }}>✉️</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', margin: '12px 0 6px 0', letterSpacing: '0.02em' }}>Newsletter GIG BR</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
              Cadastre seu e-mail para receber alertas de vagas em primeira mão e desbloquear o acesso completo a esta oportunidade!
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
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', color: '#475569' }}>E-mail de Contato</label>
              <input 
                type="email" required className="form-input" placeholder="seu@email.com.br"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', color: '#475569' }}>Ocupação de Interesse</label>
              <select 
                className="form-input" value={interest} onChange={e => setInterest(e.target.value)}
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              >
                <option value="Músicos">Músicos</option>
                <option value="Roadies">Roadies</option>
                <option value="Técnicos">Técnicos</option>
                <option value="Artistas">Artistas</option>
              </select>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontWeight: 800, marginTop: '8px' }}>
              {submitting ? 'Inscrevendo...' : 'Inscrever-se e Acessar Vaga'}
            </button>
          </form>

          <button onClick={onBack} style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', marginTop: '16px', cursor: 'pointer', textDecoration: 'underline' }}>
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  // Render Opportunity Card View
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px', backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(219, 234, 254) 100%)' }}>
      <div className="glass-panel" style={{ 
        maxWidth: '520px', 
        width: '100%', 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
        border: '1px solid #e2e8f0', 
        color: '#0f172a',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Opportunity Card Header */}
        <div style={{ padding: '28px 28px 20px 28px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase' }}>
              💼 {opportunity.category}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
              ● {opportunity.status || 'Aberta'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 6px 0', color: '#0f172a', lineHeight: '1.2' }}>{opportunity.title}</h2>
          <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: 0 }}>
            🏢 {opportunity.company || 'Produtora Contratante'}
          </p>
        </div>

        {/* Card Body */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '80px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Cachê Proposto</span>
              <strong style={{ fontSize: '1.1rem', color: '#059669' }}>{opportunity.payment}</strong>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Data Programada</span>
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{opportunity.date ? new Date(opportunity.date).toLocaleDateString('pt-BR') : 'A definir'}</strong>
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Local da Gig</span>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              📍 {opportunity.location}
            </p>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Descrição da Oportunidade</span>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
              {opportunity.description || "Nenhum detalhe adicional informado para esta vaga."}
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid #fef3c7',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.8rem',
            color: '#b45309',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontWeight: 500,
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '1rem', marginTop: '-2px' }}>💡</span>
            <span>
              <strong>Aviso para Convidados:</strong> Você está acessando apenas esta vaga específica de forma restrita. Para visualizar dezenas de outras oportunidades na sua região e candidatar-se, registre-se na plataforma.
            </span>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => {
                showToast("Para candidatar-se, crie ou acesse sua conta GIG BR no painel principal utilizando este código de acesso nas opções de convite.", "info");
                onBack();
              }} 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', fontWeight: 800 }}
            >
              🚀 Candidatar-se no GIG BR
            </button>
            <button onClick={onBack} className="btn btn-secondary" style={{ width: '100%' }}>
              Voltar para o Início
            </button>
          </div>

        </div>

        {/* VACANCY CODE IN THE BOTTOM RIGHT CORNER */}
        <div style={{ 
          position: 'absolute', 
          bottom: '12px', 
          right: '16px', 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Vaga: {opportunity.access_code || code}
        </div>

      </div>
    </div>
  );
}
