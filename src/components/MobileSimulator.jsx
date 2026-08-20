import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import logo from '../assets/logo.png';
import { 
  IconClock, 
  IconCheck, 
  IconShield, 
  IconMapPin, 
  IconWallet, 
  IconUser, 
  IconPixSymbol,
  IconAlert,
  IconCopy
} from './Icons';

const MobileSimulator = ({ isNative = false }) => {
  const { 
    shifts, 
    contractors, 
    events, 
    selectedContractorId, 
    setSelectedContractorId,
    checkIn, 
    checkOut, 
    userLocation,
    jobOpportunities,
    getDistanceInKm,
    updateContractor,
    t,
    language,
    showToast
  } = useContext(AppContext);

  // Exactly 4 Tabs in the mobile simulator as requested:
  // 1. 'gigs' (Principal & Oportunidades mais próximas)
  // 2. 'events' (Escala de Eventos, Check-in/out)
  // 3. 'wallet' (Garantias & 50% adiantamento)
  // 4. 'profile' (Perfil & Balanço Mensal)
  const [activeTab, setActiveTab] = useState('gigs');
  const [workedHoursInput, setWorkedHoursInput] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showCheckInConfirm, setShowCheckInConfirm] = useState(false);
  const [selectedEventIdForCheckin, setSelectedEventIdForCheckin] = useState('evt-1');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [currentTime, setCurrentTime] = useState('15:27');
  
  // Account Profile Editing States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    omb: '',
    drt: '',
    bio: '',
    avatar: ''
  });

  // Find the contractor being simulated
  const contractor = contractors.find(c => c.id === selectedContractorId) || contractors[0];

  // Update clock every minute for realism
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter contractor's shifts
  const contractorShifts = shifts.filter(s => s.contractorId === contractor.id);
  
  // Find current active shift
  const activeShift = contractorShifts.find(s => s.status === 'Em Andamento');

  // Balance calculation (Unpaid finalized shifts)
  const pendingBalance = contractorShifts
    .filter(s => s.status === 'Finalizado' || s.status === 'Disputado')
    .reduce((acc, s) => acc + ((s.actualHours || s.scheduledHours) * s.hourlyRate), 0);

  // Month Statistics for Profile Balance Sheet
  const appliedGigsCount = 4; // Mocked applied count
  const completedGigsCount = contractorShifts.filter(s => s.status === 'Pago' || s.status === 'Finalizado').length;
  const totalEarnedAmount = contractorShifts
    .filter(s => s.status === 'Pago')
    .reduce((acc, s) => acc + ((s.actualHours || s.scheduledHours) * s.hourlyRate), 0);

  // Sorted Opportunities by Geolocation Proximity (lat, lng distance calculation)
  const opportunitiesWithDistance = jobOpportunities.map(job => {
    const distance = getDistanceInKm(userLocation.lat, userLocation.lng, job.lat, job.lng);
    return { ...job, distance };
  }).sort((a, b) => a.distance - b.distance);

  const handleStartCheckIn = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      setShowCheckInConfirm(true);
    }, 1200); // Simulate GPS geofencing delay
  };

  const handleConfirmCheckin = () => {
    checkIn(contractor.id, selectedEventIdForCheckin);
    setShowCheckInConfirm(false);
  };

  const handleStartCheckOut = () => {
    setWorkedHoursInput(activeShift?.scheduledHours || '8');
  };

  const handleConfirmCheckout = () => {
    if (activeShift) {
      checkOut(activeShift.id, workedHoursInput);
    }
  };

  const handleSwitchContractor = (e) => {
    setSelectedContractorId(e.target.value);
    setShowEditProfile(false); // Reset profile edit tab when switching users
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: contractor.name || '',
      role: contractor.role || '',
      email: contractor.email || `${contractor.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: contractor.phone || '(11) 98888-7777',
      omb: contractor.omb || '',
      drt: contractor.drt || '',
      bio: contractor.bio || '',
      avatar: contractor.avatar || ''
    });
    setShowEditProfile(true);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '380px',
      margin: '0 auto',
      backgroundColor: '#000000', // Sleek phone bezel color
      borderRadius: '40px',
      padding: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      border: '4px solid #1f1f23',
      color: '#18181b'
    }}>
      {/* Phone Screen Container */}
      <div style={{
        backgroundColor: '#f6f7fb',
        borderRadius: '32px',
        overflow: 'hidden',
        minHeight: '620px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* Phone Notch / Status Bar */}
        <div style={{
          height: '28px',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          borderBottom: '1px solid rgba(0,0,0,0.03)',
          zIndex: 10
        }}>
          <span>{currentTime}</span>
          <div style={{
            width: '60px',
            height: '14px',
            backgroundColor: '#000000',
            borderRadius: '0 0 10px 10px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0
          }} />
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span>5G</span>
            <div style={{ width: '16px', height: '10px', border: '1px solid #18181b', borderRadius: '2px', padding: '1px', display: 'flex' }}>
              <div style={{ width: '100%', height: '100%', backgroundColor: '#10b981', borderRadius: '1px' }} />
            </div>
          </div>
        </div>

        {/* Dynamic Simulated User Context Switcher */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>PRESTADOR SIMULADO:</span>
          <select 
            value={selectedContractorId}
            onChange={handleSwitchContractor}
            className="form-input"
            style={{ padding: '3px 8px', fontSize: '0.75rem', width: '160px', height: 'auto', backgroundColor: '#f4f4f5' }}
          >
            {contractors.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
            ))}
          </select>
        </div>

        {/* Main Phone App Scrollable Body */}
        <div style={{ flexGrow: 1, padding: '12px', overflowY: 'auto', maxHeight: '480px' }}>
          
          {showEditProfile ? (
            /* EDIT PROFILE SCREEN */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                  ✏️ Editar Perfil/Conta
                </h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>OMB/DRT Opcional</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Avatar upload / pull */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Foto de Perfil (Max 2MB)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img 
                      src={editForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'} 
                      alt="Preview" 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-green)' }}
                    />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            showToast("Erro: O tamanho máximo do arquivo é de 2MB.", "error");
                            e.target.value = "";
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditForm({...editForm, avatar: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ fontSize: '0.6rem', flexGrow: 1 }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const randomFaces = [
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
                      ];
                      const chosen = randomFaces[Math.floor(Math.random() * randomFaces.length)];
                      setEditForm({...editForm, avatar: chosen});
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.6rem', padding: '3px 8px', marginTop: '6px', width: '100%' }}
                  >
                    🔄 Puxar Foto da Conta Social
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    style={{ padding: '6px', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Função Principal</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    style={{ padding: '6px', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>E-mail de Contato</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    style={{ padding: '6px', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Telefone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    style={{ padding: '6px', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>Resumo Profissional / Bio</label>
                    <span style={{ fontSize: '0.6rem', color: (editForm.bio || '').length >= 250 ? 'red' : 'var(--text-muted)' }}>{(editForm.bio || '').length}/250</span>
                  </div>
                  <textarea 
                    className="form-input" 
                    rows="3"
                    value={editForm.bio}
                    maxLength="250"
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    style={{ padding: '6px', fontSize: '0.75rem', resize: 'none', fontFamily: 'inherit', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>OMB (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editForm.omb}
                      onChange={(e) => setEditForm({...editForm, omb: e.target.value})}
                      style={{ padding: '6px', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>DRT (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editForm.drt}
                      onChange={(e) => setEditForm({...editForm, drt: e.target.value})}
                      style={{ padding: '6px', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button 
                    onClick={() => {
                      updateContractor(contractor.id, editForm);
                      setShowEditProfile(false);
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    Salvar
                  </button>
                  <button 
                    onClick={() => setShowEditProfile(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
            {/* TAB 1: GIGS / PRINCIPAL & PROXIMITY SEARCH */}
            {activeTab === 'gigs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Header card displaying current GPS coords */}
              <div style={{
                backgroundColor: 'var(--color-green-light)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                textAlign: 'left'
              }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#047857' }}>
                  📍 Localização do Prestador
                </p>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 900, marginTop: '2px' }}>{userLocation.cityName}</h4>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  GPS: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>

              {/* Nearest Opportunities */}
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'left', marginTop: '6px' }}>
                Oportunidades Próximas ({opportunitiesWithDistance.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {opportunitiesWithDistance.map(job => (
                  <div 
                    key={job.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{job.title}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-green)' }}>
                        📍 {job.distance} km
                      </span>
                    </div>

                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      {job.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '4px', fontSize: '0.65rem' }}>
                      <span style={{ fontWeight: 700 }}>Cache: {job.payment}</span>
                      <button 
                        onClick={() => showToast(`Candidatura enviada para "${job.title}". Distância calculada: ${job.distance} km.`, "success")}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                      >
                        Candidatar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: EVENTS & CHECK-IN / CHECK-OUT */}
          {activeTab === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'left' }}>
                {t.activeShift}
              </h3>

              {activeShift ? (
                /* Ongoing shift view */
                <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--color-green)', textAlign: 'center' }}>
                  <div className="badge badge-green pulse-active" style={{ display: 'inline-flex', marginBottom: '8px' }}>
                    {t.workingNow}
                  </div>
                  
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {events.find(e => e.id === activeShift.eventId)?.name || 'Show Ativo'}
                  </h4>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Check-in realizado às <strong style={{ color: 'var(--text-main)' }}>{activeShift.checkInTime}</strong>
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '14px', paddingTop: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', textAlign: 'left' }}>
                      Total de Horas Trabalhadas:
                    </label>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={workedHoursInput}
                        onChange={(e) => setWorkedHoursInput(e.target.value)}
                        placeholder="Ex: 8"
                        style={{ fontSize: '0.85rem', padding: '6px' }}
                      />
                      <button 
                        onClick={handleConfirmCheckout}
                        className="btn btn-primary"
                        style={{ flexShrink: 0, padding: '8px 14px', fontSize: '0.8rem' }}
                      >
                        {t.checkOutBtn}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Scheduled checkin options */
                <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-yellow)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Próximas Escalas Agendadas</span>
                  </div>

                  {contractorShifts.filter(s => s.status === 'Agendado').length === 0 ? (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Nenhuma escala agendada. Aguardando convocação de produtoras.
                    </p>
                  ) : (
                    contractorShifts.filter(s => s.status === 'Agendado').map(s => {
                      const evt = events.find(e => e.id === s.eventId);
                      return (
                        <div key={s.id} style={{ padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '8px', backgroundColor: '#fafafa' }}>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: 800 }}>{evt?.name}</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                            <span>📍 {evt?.location}</span>
                            <span>💵 R$ {(s.scheduledHours * s.hourlyRate).toFixed(2)}</span>
                          </div>

                          {s.depositPaid && (
                            <div style={{ 
                              backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                              border: '1px solid rgba(16, 185, 129, 0.2)', 
                              borderRadius: '3px', 
                              padding: '4px 8px', 
                              marginTop: '6px', 
                              fontSize: '0.65rem',
                              color: '#047857',
                              fontWeight: 700
                            }}>
                              ✅ Sinal de 50% Pago (R$ {s.depositAmount.toFixed(2)})
                            </div>
                          )}

                          <button 
                            onClick={handleStartCheckIn} 
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', marginTop: '8px', padding: '6px' }}
                          >
                            Realizar Check-in (GPS)
                          </button>
                        </div>
                      );
                    })
                  )}

                  {showCheckInConfirm && (
                    <div style={{ 
                      backgroundColor: '#fef3c7', 
                      border: '1px solid #f59e0b', 
                      borderRadius: 'var(--radius-sm)', 
                      padding: '10px', 
                      marginTop: '10px' 
                    }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b45309' }}>
                        ⚠️ Confirmar coordenadas do Sambódromo / Allianz Parque via GPS do dispositivo?
                      </p>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button onClick={handleConfirmCheckin} className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }}>
                          Sim, Entrar
                        </button>
                        <button onClick={() => setShowCheckInConfirm(false)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: WALLET & 50% GUARANTEES */}
          {activeTab === 'wallet' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Wallet header */}
              <div style={{
                backgroundColor: 'var(--text-main)',
                color: '#ffffff',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8 }}>
                  Saldo Disponível p/ Saque
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '2px' }}>
                  R$ {totalEarnedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>

              {/* Upfront Prepayment Verification list */}
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'left', marginTop: '6px' }}>
                Garantias e Sinais (50% Pago)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {contractorShifts.filter(s => s.depositPaid).length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    Nenhum sinal ou depósito antecipado pendente.
                  </p>
                ) : (
                  contractorShifts.filter(s => s.depositPaid).map(s => {
                    const evt = events.find(e => e.id === s.eventId);
                    return (
                      <div key={s.id} className="glass-panel" style={{ padding: '10px', border: '1px solid var(--border-color)', fontSize: '0.7rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                          <span>{evt?.name}</span>
                          <span style={{ color: 'var(--color-green)' }}>50% Pago</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <p>Depósito Antecipado: R$ {s.depositAmount.toFixed(2)}</p>
                          <p style={{ fontSize: '0.6rem' }}>Confirmado em: {s.depositConfirmedAt}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Direct payment history */}
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'left', marginTop: '6px' }}>
                Histórico de Recebimentos
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {contractorShifts.filter(s => s.status === 'Pago').map(s => {
                  const evt = events.find(e => e.id === s.eventId);
                  const total = (s.actualHours || s.scheduledHours) * s.hourlyRate;
                  return (
                    <div key={s.id} className="glass-panel" style={{ padding: '10px', border: '1px solid var(--border-color)', fontSize: '0.7rem', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800 }}>{evt?.name}</span>
                        <span style={{ color: '#047857', fontWeight: 700 }}>R$ {total.toFixed(2)}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', marginTop: '2px' }}>
                        Liquidado via PIX em {s.paidAt}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: PROFILE & MONTHLY FINANCIAL STATEMENT */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Profile info - Clickable to edit contractor details */}
              <div 
                onClick={handleOpenEdit}
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'center', 
                  textAlign: 'left', 
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <img 
                  src={contractor.avatar} 
                  alt={contractor.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--color-green)', objectFit: 'cover' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textDecoration: 'underline', color: 'var(--text-main)' }}>
                      {contractor.name}
                    </h4>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-green)', fontWeight: 700 }}>✏️ EDITAR</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{contractor.role}</p>
                </div>
              </div>

              {/* OMB / DRT details */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '8px 12px', 
                fontSize: '0.7rem', 
                textAlign: 'left' 
              }}>
                {contractor.omb && <p><strong>OMB Músico:</strong> {contractor.omb}</p>}
                {contractor.drt && <p><strong>Registro DRT:</strong> {contractor.drt}</p>}
                <p style={{ marginTop: '2px' }}>
                  <strong>Credenciamento:</strong> <span style={{ color: 'var(--color-green)', fontWeight: 700 }}>Homologado GIG BR</span>
                </p>
              </div>

              {/* Monthly Financial Balance Sheet */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'left'
              }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  📊 Balanço Mensal GIG BR
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Gigs Candidatadas:</span>
                    <span style={{ fontWeight: 700 }}>{appliedGigsCount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Gigs Concretizadas:</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-green)' }}>{completedGigsCount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ fontWeight: 700 }}>Total Recebido:</span>
                    <span style={{ fontWeight: 800, color: 'var(--color-green)' }}>R$ {totalEarnedAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          </>
          )}

        </div>

        {/* 4 Tabs Mobile Footer Navigation Menu */}
        <div style={{
          height: '56px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: '6px',
          zIndex: 10
        }}>
          {/* Tab 1: Busca de Gigs */}
          <button 
            onClick={() => setActiveTab('gigs')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.6rem',
              fontWeight: activeTab === 'gigs' ? 800 : 500,
              color: activeTab === 'gigs' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>🔍</span>
            <span>Buscar Gigs</span>
          </button>

          {/* Tab 2: Escala / Eventos */}
          <button 
            onClick={() => setActiveTab('events')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.6rem',
              fontWeight: activeTab === 'events' ? 800 : 500,
              color: activeTab === 'events' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>📅</span>
            <span>Eventos</span>
          </button>

          {/* Tab 3: Financeiro / Garantias */}
          <button 
            onClick={() => setActiveTab('wallet')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.6rem',
              fontWeight: activeTab === 'wallet' ? 800 : 500,
              color: activeTab === 'wallet' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>🛡️</span>
            <span>Garantias</span>
          </button>

          {/* Tab 4: Balanço / Perfil */}
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.6rem',
              fontWeight: activeTab === 'profile' ? 800 : 500,
              color: activeTab === 'profile' ? 'var(--color-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '1rem' }}>📊</span>
            <span>Balanço</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default MobileSimulator;
