import React, { createContext, useState, useEffect } from 'react';
import { mockEvents, mockContractors, mockShifts } from '../data/mockData';



const getApiOrigin = () => {
  if (typeof window === 'undefined') return '';
  const { protocol, hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:3001`;
  }
  return window.location.origin;
};
const apiOrigin = getApiOrigin();

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt-BR'); // 'pt-BR' or 'en'
  const [events, setEvents] = useState(mockEvents);
  
  // Extend mock contractors with default bios and credentials
  const extendedContractors = mockContractors.map(c => {
    let bio = '';
    if (c.category === 'Músicos') {
      bio = 'Instrumentista profissional com sólida experiência em palcos de grande porte, gravações em estúdio e arranjos musicais. Portador de credencial ativa.';
    } else if (c.category === 'Técnicos') {
      bio = 'Técnico de áudio e iluminação especializado em consoles digitais, alinhamento de sistemas de P.A. e suporte operacional durante festivais nacionais.';
    } else if (c.category === 'Roadies') {
      bio = 'Auxiliar de palco experiente em montagem de bateria, afinação de instrumentos de corda e suporte rápido nas laterais do palco. Trabalho ágil e seguro.';
    } else {
      bio = 'Profissional da área artística com foco em performances cênicas, coreografias e entretenimento ao vivo. Registro ativo e flexibilidade de horários.';
    }
    return {
      ...c,
      bio,
      email: c.email || `${c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.')}@gmail.com`,
      phone: c.phone || '(11) 98888-7777',
      omb: c.category === 'Músicos' ? 'OMB/SP 48312' : '',
      drt: c.category !== 'Músicos' ? 'DRT/ART 99318' : ''
    };
  });

  const [contractors, setContractors] = useState(extendedContractors);
  const [shifts, setShifts] = useState(mockShifts);
  const [activeEventId, setActiveEventId] = useState('evt-1');
  const [selectedContractorId, setSelectedContractorId] = useState('cont-3'); // Bruno Lima (Guitarrista)
  
  // Geolocation States
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [userLocation, setUserLocation] = useState({
    lat: -23.5489, // Default SP coordinates
    lng: -46.6388,
    region: 'SP',
    cityName: 'São Paulo - SP',
    isSimulated: true
  });
  
  // Active Filter for proximity
  const [proximityFilterEnabled, setProximityFilterEnabled] = useState(false);
  const [validAccessCodes, setValidAccessCodes] = useState(['BRASIL2027']);

  // Real-time notification log
  const [notifications, setNotifications] = useState([]);
  
  // Auth state for logged in profile view
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin', 'employer', 'freelancer'

  // PIX Modal State
  const [pixModal, setPixModal] = useState({
    show: false,
    shift: null,
    contractor: null,
    isDeposit: false // Flag to determine if it is a 50% deposit confirmation
  });

  // Helper distance function
  function getDistanceInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return Math.round(d * 10) / 10;
  }

  // Job Opportunities State with coordinates
  const [jobOpportunities, setJobOpportunities] = useState([
    { id: 'job-1', title: 'Guitarrista Solo - Show Pop/Rock', category: 'Músicos', company: 'Arena Hall BH', payment: 'R$ 600.00', date: '2027-04-12', location: 'Belo Horizonte - MG', lat: -19.9167, lng: -43.9345, description: 'Procura-se guitarrista solo experiente em solos pop/rock dos anos 80/90. Turno de 6h de palco.', status: 'Aberta' },
    { id: 'job-2', title: 'Roadie de Palco e Cordas', category: 'Roadies', company: 'Mainstage Produções', payment: 'R$ 350.00', date: '2027-02-15', location: 'São Paulo - SP', lat: -23.5489, lng: -46.6388, description: 'Montagem, afinação de instrumentos de corda e apoio lateral de palco durante festival.', status: 'Aberta' },
    { id: 'job-3', title: 'Técnico de Iluminação e Mapeamento', category: 'Técnicos', company: 'Anhembi Eventos', payment: 'R$ 500.00', date: '2027-02-12', location: 'São Paulo - SP', lat: -23.5150, lng: -46.6380, description: 'Operador de console de luz e ajuste de refletores móveis para desfile de carnaval.', status: 'Aberta' },
    { id: 'job-4', title: 'Dançarino Performista de Palco', category: 'Artistas', company: 'Carioca Entretenimento', payment: 'R$ 450.00', date: '2026-12-31', location: 'Rio de Janeiro - RJ', lat: -22.9068, lng: -43.1729, description: 'Coreografia de palco para show de Réveillon de grande escala. Ensaios inclusos.', status: 'Aberta' }
  ]);

  // Initial employers list for directory cards
  const [employers, setEmployers] = useState([
    { id: 'emp-1', companyName: 'Mainstage Produções', name: 'Gabriel Ribeiro', cnpj: '12.345.678/0001-90', city: 'São Paulo - SP', state: 'SP', hiringMode: 'NF', thirdPartyInvoice: 'OWN_ONLY', bio: 'Produtora executiva voltada a festivais eletrônicos e turnês de bandas internacionais no Brasil. Exigimos Nota Fiscal eletrônica.' },
    { id: 'emp-2', companyName: 'Arena Hall BH', name: 'Fernanda Lima', cnpj: '45.882.111/0001-55', city: 'Belo Horizonte - MG', state: 'MG', hiringMode: 'DIRETA', thirdPartyInvoice: '', bio: 'Espaço multiuso para eventos culturais, shows de rock, peças teatrais e eventos corporativos de grande porte em Minas Gerais.' },
    { id: 'emp-3', companyName: 'Carioca Entretenimento', name: 'Roberto Souza', cnpj: '82.993.444/0001-33', city: 'Rio de Janeiro - RJ', state: 'RJ', hiringMode: 'DIRETA', thirdPartyInvoice: '', bio: 'Agenciadora de eventos cênicos de grande escala, focada em shows de Réveillon, desfiles e apresentações na orla carioca.' }
  ]);

  // Groups and Bands State
  const [groups, setGroups] = useState([
    { id: 'group-1', name: 'Banda Samba & Swing BR', category: 'Músicos', description: 'Grupo musical especializado em samba de roda, bossa nova e ritmos brasileiros para recepções corporativas e casamentos.', members: ['cont-3', 'cont-8'], city: 'São Paulo - SP', state: 'SP' }
  ]);

  // Fetch initial data from Backend server API with local memory fallback
  const refreshAllData = async () => {
    try {
      const eventsRes = await fetch(`${apiOrigin}/api/events`);
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        if (data && data.length > 0) setEvents(data);
      }

      const usersRes = await fetch(`${apiOrigin}/api/users`);
      if (usersRes.ok) {
        const allUsers = await usersRes.json();
        
        // Filter contractors (freelancers)
        const freelancers = allUsers.filter(u => u.role === 'freelancer');
        if (freelancers.length > 0) {
          setContractors(freelancers.map(u => ({
            id: u.id,
            name: u.name,
            role: u.role || 'Prestador',
            category: u.category || 'Músicos',
            rating: parseFloat(u.rating || 5.0),
            completedShifts: parseInt(u.completed_shifts || 0),
            cpf: u.cpf,
            cnpj: u.cnpj,
            pixKey: u.pixKey || u.pix_key || u.cpf || u.cnpj || '',
            pixType: u.pixType || u.pix_type || 'CPF',
            city: u.city,
            state: u.state,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
            email: u.email,
            phone: u.phone,
            omb: u.omb,
            drt: u.drt,
            bio: u.bio,
            isVetted: !!u.is_vetted
          })));
        }
        
        // Filter employers
        const emps = allUsers.filter(u => u.role === 'employer');
        if (emps.length > 0) {
          setEmployers(emps.map(u => ({
            id: u.id,
            name: u.name,
            companyName: u.companyName || u.name,
            cnpj: u.cnpj || '',
            city: u.city || 'São Paulo',
            state: u.state || 'SP',
            hiringMode: u.hiringMode || 'NF',
            thirdPartyInvoice: u.thirdPartyInvoice || 'OWN_ONLY',
            bio: u.bio || ''
          })));
        }
        try {
          localStorage.setItem('gigbr_users', JSON.stringify(allUsers));
        } catch (e) {}
      }

      const shiftsRes = await fetch(`${apiOrigin}/api/shifts`);
      if (shiftsRes.ok) {
        const data = await shiftsRes.json();
        if (data && data.length > 0) {
          setShifts(data.map(s => ({
            id: s.id,
            eventId: s.event_id || s.eventId,
            contractorId: s.contractor_id || s.contractorId,
            date: s.date,
            scheduledHours: parseFloat(s.scheduled_hours || s.scheduledHours || 8),
            actualHours: s.actual_hours !== null ? parseFloat(s.actual_hours) : null,
            hourlyRate: parseFloat(s.hourly_rate || s.hourlyRate || 35),
            status: s.status,
            checkInTime: s.check_in_time || null,
            checkOutTime: s.check_out_time || null,
            disputeNotes: s.dispute_notes || '',
            invoiceEmitted: !!s.invoice_emitted,
            depositPaid: !!s.deposit_paid,
            depositAmount: parseFloat(s.deposit_amount || 0),
            depositConfirmedAt: s.deposit_confirmed_at || null,
            paidAt: s.paid_at || null,
            pixReceiptCode: s.pix_receipt_code || null
          })));
        }
      }

      const oppsRes = await fetch(`${apiOrigin}/api/opportunities`);
      if (oppsRes.ok) {
        const data = await oppsRes.json();
        if (data && data.length > 0) {
          setJobOpportunities(data);
          const codes = data.map(o => o.access_code).filter(Boolean);
          setValidAccessCodes(prev => [...new Set([...prev, ...codes])]);
        }
      }

      const groupsRes = await fetch(`${apiOrigin}/api/groups`);
      if (groupsRes.ok) {
        const data = await groupsRes.json();
        if (data && data.length > 0) {
          const mapped = await Promise.all(data.map(async (g) => {
            const membersRes = await fetch(`${apiOrigin}/api/groups/${g.id}/members`);
            if (membersRes.ok) {
              const members = await membersRes.json();
              g.members = members.map(m => m.id);
            } else {
              g.members = g.members || [];
            }
            return g;
          }));
          setGroups(mapped);
          try {
            localStorage.setItem('gigbr_groups', JSON.stringify(mapped));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn("Backend server connection failed. Running in offline Local-First memory mode.", err);
      try {
        const storedUsers = localStorage.getItem('gigbr_users');
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          const freelancers = parsed.filter(u => u.role === 'freelancer');
          if (freelancers.length > 0) setContractors(freelancers);
          const emps = parsed.filter(u => u.role === 'employer');
          if (emps.length > 0) setEmployers(emps);
        }
      } catch (e) {}
      try {
        const storedGroups = localStorage.getItem('gigbr_groups');
        if (storedGroups) setGroups(JSON.parse(storedGroups));
      } catch (e) {}
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  function toggleLanguage() {
    setLanguage(prev => prev === 'pt-BR' ? 'en' : 'pt-BR');
  }

  function addNotification(sender, message, audience = 'all', eventId = null) {
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender, // 'system', 'web', 'mobile'
      message,
      timestamp,
      audience, // 'all', 'web', 'mobile'
      eventId
    };
    setNotifications(prev => [newNotif, ...prev]);
  }

  async function requestGeolocation() {
    setGpsStatus('loading');
    if (!navigator.geolocation) {
      setGpsStatus('error');
      addNotification('system', 'GPS não suportado neste navegador. Usando padrão SP.', 'all');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let resolvedCity = 'São Paulo - SP';
          let region = 'SP';
          
          if (lat > -22.5 && lat < -21.5) {
            resolvedCity = 'Campos do Jordão - SP';
          } else if (lat > -23.1 && lat < -22.8) {
            resolvedCity = 'Rio de Janeiro - RJ';
            region = 'RJ';
          }

          setUserLocation({
            lat,
            lng,
            region,
            cityName: resolvedCity,
            isSimulated: false
          });
          setGpsStatus('success');
          addNotification('system', `GPS localizado com sucesso em: ${resolvedCity}`, 'all');
        },
        (error) => {
          setGpsStatus('error');
          addNotification('system', 'Acesso ao GPS recusado ou indisponível. Usando padrão SP.', 'all');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } catch (e) {
      setGpsStatus('error');
      addNotification('system', 'Erro ao acessar GPS. Usando padrão SP.', 'all');
    }
  }

  function mockLocation(regionCode) {
    let mockCoords = { lat: -23.5489, lng: -46.6388, cityName: 'São Paulo - SP' };
    if (regionCode === 'RJ') {
      mockCoords = { lat: -22.9068, lng: -43.1729, cityName: 'Rio de Janeiro - RJ' };
    } else if (regionCode === 'MG') {
      mockCoords = { lat: -19.9167, lng: -43.9345, cityName: 'Belo Horizonte - MG' };
    }

    setUserLocation({
      ...mockCoords,
      region: regionCode,
      isSimulated: false
    });
    setGpsStatus('success');
    addNotification('system', `Região de atuação alterada para: ${mockCoords.cityName}`, 'all');
  }

  // Handle onboarding registrations (synced with DB)
  async function registerFreelancer(data) {
    const isPessoaFisica = data.registrationType === 'PF';
    const newFreelancer = {
      id: data.id || `cont-${Date.now()}`,
      name: data.name,
      role: data.role || 'freelancer',
      category: data.category,
      rating: 5.0,
      completed_shifts: 0,
      cpf: data.cpf || '***.***.***-**',
      cnpj: isPessoaFisica ? '' : (data.cnpj || '00.000.000/0001-00'),
      registration_type: data.registrationType || 'PF',
      pixKey: data.pixKey || (isPessoaFisica ? data.cpf : data.cnpj),
      pixType: data.pixType || (isPessoaFisica ? 'CPF' : 'CNPJ'),
      city: data.city || 'São Paulo - SP',
      state: data.state || 'SP',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      email: data.email,
      phone: data.phone,
      omb: data.omb || '',
      drt: data.drt || '',
      bio: data.bio || 'Profissional cadastrado no GIG BR.',
      role_type: 'freelancer'
    };

    try {
      const res = await fetch(`${apiOrigin}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newFreelancer, role: 'freelancer' })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao cadastrar profissional no banco de dados.');
      }
      const dbUser = await res.json();
      newFreelancer.id = dbUser.id;
    } catch (err) {
      if (err.message.includes('cadastrar profissional') || err.message.includes('já cadastrado') || err.message.includes('E-mail ou documento')) {
        throw err;
      }
      console.warn("API offline. Storing contractor in React memory state.", err.message);
    }

    setContractors(prev => {
      const updated = [newFreelancer, ...prev];
      try {
        const storedUsers = localStorage.getItem('gigbr_users');
        const parsed = storedUsers ? JSON.parse(storedUsers) : [];
        const filtered = parsed.filter(u => u.id !== newFreelancer.id);
        localStorage.setItem('gigbr_users', JSON.stringify([{ ...newFreelancer, role: 'freelancer' }, ...filtered]));
      } catch (e) {}
      return updated;
    });
    addNotification('system', `Profissional cadastrado (${isPessoaFisica ? 'PF' : 'MEI'}): ${newFreelancer.name}`, 'all');
  }

  async function registerEmployer(data) {
    const newEmployer = {
      id: data.id || `emp-${Date.now()}`,
      name: data.name,
      companyName: data.companyName,
      cnpj: data.cnpj,
      city: data.city || 'São Paulo - SP',
      state: data.state || 'SP',
      hiringMode: data.hiringMode || 'NF',
      thirdPartyInvoice: data.hiringMode === 'NF' ? (data.thirdPartyInvoice || 'OWN_ONLY') : '',
      bio: data.bio || 'Contratante cadastrado no ecossistema GIG BR.',
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@produtora.com`,
      phone: data.phone || '(11) 98888-5555',
      pixKey: data.pixKey || data.cnpj || '',
      pixType: data.pixType || 'CNPJ',
      role: 'employer'
    };

    try {
      const res = await fetch(`${apiOrigin}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEmployer,
          role: 'employer'
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao cadastrar produtor no banco de dados.');
      }
      const dbUser = await res.json();
      newEmployer.id = dbUser.id;
    } catch (err) {
      if (err.message.includes('cadastrar produtor') || err.message.includes('já cadastrado') || err.message.includes('E-mail ou documento')) {
        throw err;
      }
      console.warn("API offline. Storing employer in local React state.", err.message);
    }

    setEmployers(prev => {
      const updated = [newEmployer, ...prev];
      try {
        const storedUsers = localStorage.getItem('gigbr_users');
        const parsed = storedUsers ? JSON.parse(storedUsers) : [];
        const filtered = parsed.filter(u => u.id !== newEmployer.id);
        localStorage.setItem('gigbr_users', JSON.stringify([{ ...newEmployer, role: 'employer' }, ...filtered]));
      } catch (e) {}
      return updated;
    });
    addNotification('system', `Contratante cadastrado: ${newEmployer.companyName}`, 'all');
  }

  async function postJobOpportunity(data) {
    let lat = -23.5489;
    let lng = -46.6388;
    if (data.location.includes('RJ')) {
      lat = -22.9068;
      lng = -43.1729;
    } else if (data.location.includes('MG')) {
      lat = -19.9167;
      lng = -43.9345;
    }

    const generatedCode = `OP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newJob = {
      id: `job-${Date.now()}`,
      title: data.title,
      category: data.category,
      company: data.company || 'Produtora Demo',
      payment: `R$ ${parseFloat(data.payment || 0).toFixed(2)}`,
      date: data.date,
      location: data.location || 'São Paulo - SP',
      lat,
      lng,
      description: data.description || '',
      status: 'Aberta',
      access_code: generatedCode
    };

    try {
      await fetch(`${apiOrigin}/api/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
    } catch (err) {
      console.warn("API offline. Storing opportunity in memory.");
    }

    setValidAccessCodes(prev => [...prev, generatedCode]);
    setJobOpportunities(prev => [newJob, ...prev]);
    addNotification('web', `Nova oportunidade publicada: ${newJob.title}. Código gerado: ${generatedCode}`, 'all');
    alert(`Vaga publicada com sucesso!\nCódigo de acesso gerado para produtores: ${generatedCode}`);
  }

  async function createEvent(data) {
    const newEvent = {
      id: `evt-${Date.now()}`,
      name: data.name,
      date: data.date,
      location: data.location || 'São Paulo - SP',
      state: data.state || 'SP',
      latitude: data.latitude || -23.5489,
      longitude: data.longitude || -46.6388,
      budgetLimit: parseFloat(data.budgetLimit || 0),
      currentSpend: 0,
      vesselStatus: 'Ativo',
      employer_id: data.employer_id || data.employerId || '',
      crowdfundGoal: parseFloat(data.crowdfundGoal || 0),
      crowdfundRaised: parseFloat(data.crowdfundRaised || 0),
      description: data.description || '',
      pixKey: data.pixKey || data.pix_key || ''
    };

    try {
      const res = await fetch(`${apiOrigin}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        const dbEvent = await res.json();
        newEvent.id = dbEvent.id;
      }
    } catch (err) {
      console.warn("API offline. Saving event to local React state.");
    }

    setEvents(prev => [...prev, newEvent]);
    addNotification('system', `Novo evento cadastrado: ${newEvent.name}`, 'all', newEvent.id);
    return newEvent;
  }

  async function updateEvent(id, data) {
    try {
      const res = await fetch(`${apiOrigin}/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.warn("API offline. Updating event in local React state.");
    }
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    addNotification('system', `Show/Evento atualizado.`, 'all', id);
  }

  async function deleteEvent(id) {
    try {
      const res = await fetch(`${apiOrigin}/api/events/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.warn("API offline. Deleting event from local state.");
    }
    setEvents(prev => prev.filter(e => e.id !== id));
    addNotification('system', `Show/Evento excluído do sistema.`, 'all');
  }

  async function assignShiftToEvent(shiftData) {
    const newShift = {
      id: `shift-${Date.now()}`,
      eventId: shiftData.eventId,
      contractorId: shiftData.contractorId,
      date: shiftData.date || new Date().toISOString().split('T')[0],
      scheduledHours: parseFloat(shiftData.scheduledHours || 8),
      actualHours: null,
      hourlyRate: parseFloat(shiftData.hourlyRate || 35),
      status: 'Agendado',
      checkInTime: null,
      checkOutTime: null,
      disputeNotes: '',
      invoiceEmitted: false,
      depositPaid: false,
      depositAmount: 0
    };

    try {
      await fetch(`${apiOrigin}/api/shifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShift)
      });
    } catch (err) {
      console.warn("API offline. Storing shift in memory.");
    }

    setShifts(prev => [...prev, newShift]);
    
    const totalCost = newShift.scheduledHours * newShift.hourlyRate;
    setEvents(prev => prev.map(e => {
      if (e.id === shiftData.eventId) {
        const updatedSpend = (e.currentSpend || 0) + totalCost;
        fetch(`${apiOrigin}/api/events/${e.id}/spend`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentSpend: updatedSpend })
        }).catch(() => {});
        return { ...e, currentSpend: updatedSpend };
      }
      return e;
    }));

    addNotification('system', `Profissional alocado no evento. Custo alocado: R$ ${totalCost.toFixed(2)}`, 'all', shiftData.eventId);
  }

  async function updateContractor(id, newData) {
    try {
      const current = contractors.find(c => c.id === id) || (currentUser && currentUser.id === id ? currentUser : {});
      const mergedData = { ...current, ...newData };
      await fetch(`${apiOrigin}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedData)
      });
    } catch (err) {
      console.warn("API offline. Updating contractor in local state.");
    }

    setContractors(prev => prev.map(c => c.id === id ? { ...c, ...newData } : c));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...newData }));
    }
    const name = newData.name || 'Prestador';
    addNotification('system', `Perfil do profissional "${name}" atualizado com sucesso.`, 'all');
  }

  async function updateEmployer(id, newData) {
    try {
      const current = employers.find(e => e.id === id) || (currentUser && currentUser.id === id ? currentUser : {});
      const mergedData = { ...current, ...newData, role: 'employer' };
      await fetch(`${apiOrigin}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedData)
      });
    } catch (err) {
      console.warn("API offline. Updating employer in local state.");
    }

    setEmployers(prev => prev.map(e => e.id === id ? { ...e, ...newData } : e));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...newData }));
    }
    const name = newData.name || 'Contratante';
    addNotification('system', `Perfil do contratante "${name}" atualizado com sucesso.`, 'all');
  }

  async function createGroup(data) {
    const newGroup = {
      id: `group-${Date.now()}`,
      name: data.name,
      category: data.category,
      description: data.description,
      city: data.city || 'São Paulo - SP',
      state: data.city.includes('RJ') ? 'RJ' : (data.city.includes('MG') ? 'MG' : 'SP'),
      leader_id: data.leader_id || selectedContractorId,
      members: data.members || [selectedContractorId],
      email: data.email || '',
      avatar: data.avatar || ''
    };

    try {
      await fetch(`${apiOrigin}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      });
    } catch (err) {
      console.warn("API offline. Creating group in memory.");
    }

    setGroups(prev => [newGroup, ...prev]);
    addNotification('system', `Banda/Equipe formada com sucesso: ${newGroup.name}`, 'all');
  }

  // Admin delete/edit actions (synced with DB)
  async function deleteUserAdmin(id) {
    try {
      await fetch(`${apiOrigin}/api/users/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("API offline. Deleting user from local memory.");
    }
    setContractors(prev => prev.filter(c => c.id !== id));
    setEmployers(prev => prev.filter(e => e.id !== id));
    addNotification('system', `Usuário deletado por administrador central.`, 'all');
  }

  async function updateUserAdmin(id, data) {
    try {
      await fetch(`${apiOrigin}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn("API offline. Updating user in local memory.");
    }
    setContractors(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    setEmployers(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    addNotification('system', `Usuário "${data.name}" atualizado pelo administrador central.`, 'all');
  }

  async function deleteGroupAdmin(id) {
    try {
      await fetch(`${apiOrigin}/api/groups/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("API offline. Deleting group from local memory.");
    }
    setGroups(prev => prev.filter(g => g.id !== id));
    addNotification('system', `Grupo/Banda deletado por administrador central.`, 'all');
  }

  async function updateGroupAdmin(id, data) {
    try {
      await fetch(`${apiOrigin}/api/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn("API offline. Updating group in local memory.");
    }
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
    addNotification('system', `Banda/Grupo "${data.name}" atualizado pelo administrador central.`, 'all');
  }

  async function deleteOpportunityAdmin(id) {
    try {
      await fetch(`${apiOrigin}/api/opportunities/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("API offline. Deleting opportunity from local memory.");
    }
    setJobOpportunities(prev => prev.filter(o => o.id !== id));
    addNotification('system', `Oportunidade de trabalho excluída pelo administrador central.`, 'all');
  }

  async function updateOpportunityAdmin(id, data) {
    try {
      await fetch(`${apiOrigin}/api/opportunities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn("API offline. Updating opportunity in local memory.");
    }
    setJobOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
    addNotification('system', `Oportunidade "${data.title}" atualizada pelo administrador central.`, 'all');
  }

  // Physical email proposal dispatcher method
  async function sendEmailProposal(sender, recipient, subject, body) {
    try {
      const res = await fetch(`${apiOrigin}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, recipient, subject, body })
      });
      if (res.ok) {
        console.log("Email dispatch successfully logged.");
        return true;
      }
    } catch (err) {
      console.warn("Email sending API failed or offline.");
    }
    return false;
  }

  // Prepayment 50% deposit registration handler
  async function preHireWithDeposit(contractorId, eventId, totalCash) {
    const halfValue = totalCash * 0.5;
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const newShift = {
      id: `shift-${Date.now()}`,
      eventId,
      contractorId,
      date: new Date().toISOString().split('T')[0],
      scheduledHours: 8,
      actualHours: null,
      hourlyRate: totalCash / 8, // Calculate average hourly rate
      status: 'Agendado',
      checkInTime: null,
      checkOutTime: null,
      disputeNotes: '',
      invoiceEmitted: false,
      depositPaid: true,
      depositAmount: halfValue,
      depositConfirmedAt: new Date().toLocaleString('pt-BR')
    };

    try {
      await fetch(`${apiOrigin}/api/shifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShift)
      });
    } catch (err) {
      console.warn("API offline. Registering shift prepayment in local memory.");
    }

    setShifts(prev => [...prev, newShift]);
    const contractor = contractors.find(c => c.id === contractorId);
    const eventName = events.find(e => e.id === eventId)?.name || 'Evento';
    
    addNotification('web', `Contratação iniciada! 50% pago adiantado (Sinal: R$ ${halfValue.toFixed(2)}) para ${contractor?.name} na gig "${eventName}".`, 'all', eventId);
  }

  async function checkIn(contractorId, eventId) {
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const existingShift = shifts.find(s => s.contractorId === contractorId && s.eventId === eventId && s.status === 'Agendado');
    
    if (existingShift) {
      const updatedData = { ...existingShift, checkInTime: timeNow, status: 'Em Andamento' };
      try {
        await fetch(`${apiOrigin}/api/shifts/${existingShift.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
      } catch (err) {
        console.warn("API offline.");
      }

      setShifts(prev => prev.map(s => s.id === existingShift.id ? updatedData : s));
    } else {
      const newShift = {
        id: `shift-${Date.now()}`,
        eventId,
        contractorId,
        date: new Date().toISOString().split('T')[0],
        scheduledHours: 8,
        actualHours: null,
        hourlyRate: 35.00,
        status: 'Em Andamento',
        checkInTime: timeNow,
        checkOutTime: null,
        disputeNotes: '',
        invoiceEmitted: false,
        depositPaid: false,
        depositAmount: 0
      };

      try {
        await fetch(`${apiOrigin}/api/shifts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newShift)
        });
      } catch (err) {
        console.warn("API offline.");
      }

      setShifts(prev => [...prev, newShift]);
    }
    
    const contractor = contractors.find(c => c.id === contractorId);
    const eventName = events.find(e => e.id === eventId)?.name || 'Evento';
    addNotification('mobile', `Check-in realizado por ${contractor?.name} no evento "${eventName}" às ${timeNow}.`, 'web', eventId);
  }

  async function checkOut(shiftId, workedHours) {
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    const contractor = contractors.find(c => c.id === shift.contractorId);
    const hasDiff = parseFloat(workedHours) !== shift.scheduledHours;
    
    const updatedData = {
      ...shift,
      checkOutTime: timeNow,
      actualHours: parseFloat(workedHours),
      status: hasDiff ? 'Disputado' : 'Finalizado',
      disputeNotes: hasDiff ? `Divergência de horas: Declarado ${workedHours}h contra ${shift.scheduledHours}h planejadas.` : ''
    };

    try {
      await fetch(`${apiOrigin}/api/shifts/${shiftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn("API offline.");
    }

    setShifts(prev => prev.map(s => s.id === shiftId ? updatedData : s));
    
    const msg = hasDiff 
      ? `Check-out realizado por ${contractor?.name}. Turno finalizado com divergência de horas (${workedHours}h de ${shift.scheduledHours}h).`
      : `Check-out realizado por ${contractor?.name}. Turno de ${workedHours}h concluído com sucesso.`;
      
    addNotification('mobile', msg, 'web', shift.eventId);
  }

  async function adjustAndApproveHours(shiftId, approvedHours) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    const updatedData = {
      ...shift,
      actualHours: parseFloat(approvedHours),
      status: 'Finalizado',
      disputeNotes: ''
    };

    try {
      await fetch(`${apiOrigin}/api/shifts/${shiftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn("API offline.");
    }

    setShifts(prev => prev.map(s => s.id === shiftId ? updatedData : s));
    const contractor = contractors.find(c => c.id === shift.contractorId);
    addNotification('web', `Horas de turno de ${contractor?.name} aprovadas e fixadas em ${approvedHours}h.`, 'mobile', shift.eventId);
  }

  async function raiseDisputeMobile(shiftId, notes) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    const updatedData = {
      ...shift,
      status: 'Disputado',
      disputeNotes: notes
    };

    try {
      await fetch(`${apiOrigin}/api/shifts/${shiftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn("API offline.");
    }

    setShifts(prev => prev.map(s => s.id === shiftId ? updatedData : s));
    const contractor = contractors.find(c => c.id === shift.contractorId);
    addNotification('mobile', `Contestação aberta por ${contractor?.name}: "${notes}"`, 'web', shift.eventId);
  }

  function openPixPayment(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;
    const contractor = contractors.find(c => c.id === shift.contractorId);
    setPixModal({
      show: true,
      shift,
      contractor,
      isDeposit: false
    });
  }

  // Automatically update event current spend based on paid and approved shifts
  useEffect(() => {
    const updateAllSpends = async () => {
      const updatedEvents = await Promise.all(events.map(async (evt) => {
        const eventShifts = shifts.filter(s => s.eventId === evt.id);
        const spend = eventShifts.reduce((acc, shift) => {
          if (shift.status === 'Pago' || shift.status === 'Aprovado' || shift.status === 'Finalizado' || shift.status === 'Disputado') {
            const hours = shift.actualHours !== null ? shift.actualHours : shift.scheduledHours;
            return acc + (hours * (shift.hourlyRate || 0));
          }
          return acc;
        }, 0);
        const roundedSpend = Math.round(spend * 100) / 100;
        
        if (roundedSpend !== evt.currentSpend) {
          try {
            await fetch(`${apiOrigin}/api/events/${evt.id}/spend`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ currentSpend: roundedSpend })
            });
          } catch (err) {}
          return { ...evt, currentSpend: roundedSpend };
        }
        return evt;
      }));

      const spendsChanged = updatedEvents.some((evt, index) => evt.currentSpend !== events[index].currentSpend);
      if (spendsChanged) {
        setEvents(updatedEvents);
      }
    };
    updateAllSpends();
  }, [shifts]);

  async function executePixPayment(shiftId) {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    const receipt = 'E' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0') + Date.now().toString();
    const updatedData = {
      ...shift,
      status: 'Pago',
      paidAt: new Date().toLocaleString('pt-BR'),
      pixReceiptCode: receipt
    };

    try {
      await fetch(`${apiOrigin}/api/shifts/${shiftId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn("API offline.");
    }

    setShifts(prev => prev.map(s => s.id === shiftId ? updatedData : s));
    
    const contractor = contractors.find(c => c.id === shift.contractorId);
    const totalPay = (shift.actualHours || shift.scheduledHours) * (shift.hourlyRate || 0);
    const finalPayment = shift.depositPaid ? (totalPay - shift.depositAmount) : totalPay;
    
    addNotification('web', `Liquidação final PIX de R$ ${finalPayment.toFixed(2)} efetuada com sucesso para ${contractor?.name}.`, 'mobile', shift.eventId);
    setPixModal({ show: false, shift: null, contractor: null, isDeposit: false });
  }

  const t = {
    'pt-BR': {
      appName: 'GoIA Gig BR',
      langLabel: 'PT-BR',
      partnerLabel: 'Plataforma de Credenciamento Artístico e Técnico',
      inviteOnly: 'Acesso Restrito',
      enterInviteCode: 'Código de Acesso do Produtor',
      invalidInviteCode: 'Código de convite inválido.',
      loginButton: 'Acessar Painel',
      dashboardTitle: 'Gestão Geral de Gigs',
      budgetStatus: 'Orçamento do Evento',
      vettedContractors: 'Profissionais Homologados',
      shiftsVerif: 'Escala & Liberação Financeira',
      contractorName: 'Nome do Profissional',
      category: 'Categoria',
      meiStatus: 'Tributário MEI',
      status: 'Status',
      actions: 'Ações',
      paid: 'Liquidado PIX',
      disputed: 'Divergência',
      completed: 'Pendente Pagamento',
      activeOnsite: 'Trabalhando',
      scheduled: 'Escalado',
      payPix: 'Pagar via PIX',
      adjustHours: 'Ajustar Horas',
      approvedHours: 'Aprovar',
      allEvents: 'Todos os Shows',
      budgetUsage: 'Gasto Realizado',
      budgetCap: 'Teto Verba',
      warningClose: 'Atenção: Limite do orçamento próximo!',
      filterAll: 'Todas as Categorias',
      vettedLabel: 'Homologado',
      unvettedLabel: 'Pendente',
      contractorApp: 'GoIA Gig Prestador',
      activeShift: 'Escala do Dia',
      checkInBtn: 'Check-in (GPS Local)',
      checkOutBtn: 'Finalizar Gig',
      walletTitle: 'Carteira de Pagamentos',
      balance: 'Saldo Disponível',
      paidShifts: 'Gigs Liquidadas',
      submitInvoice: 'Emitir Nota/Recibo',
      verifyLocation: 'Validando GPS no Sambódromo/Allianz...',
      raiseDispute: 'Contestar Horas',
      sendDispute: 'Enviar Contestação',
      disputeNotesPlaceholder: 'Descreva a divergência de horas...',
      confirmCheckin: 'Confirmar Entrada',
      workingNow: 'Ativo na Gig',
      realtimeSync: 'Eventos de Sincronização GPS/PIX',
      webAction: 'Ação do Gestor',
      mobileAction: 'Ação do Celular',
      pixModalTitle: 'Liquidação de Cache via PIX',
      pixDesc: 'Escaneie o QR Code ou use a chave PIX copia-e-cola para efetuar a transferência direta para a conta MEI do prestador.',
      pixKeyCopy: 'Copiar Chave PIX',
      pixCopied: 'Copiado!',
      pixConfirmBtn: 'Confirmar Sucesso Bancário',
      pixStatusPaid: 'Processado D+0!',
      pixReceipt: 'Comprovante PIX Instantâneo',
      receiptDate: 'Data/Hora:',
      receiptId: 'Código E-ID:',
      receiptContractor: 'Beneficiário:',
      receiptCnpj: 'CNPJ MEI:',
      receiptAmount: 'Valor Líquido:',
      close: 'Fechar',
      socialLogin: 'Ou entre com sua conta social',
      gpsRegion: 'Região de Atuação:',
      filterProximity: 'Mostrar Gigs na minha região',
      mockGpsBtn: 'Alterar Estado'
    },
    en: {
      appName: 'GoIA Gig BR',
      langLabel: 'EN',
      partnerLabel: 'Artistic & Technical Vetting Platform',
      inviteOnly: 'Restricted Access',
      enterInviteCode: 'Producer Access Code',
      invalidInviteCode: 'Invalid code.',
      loginButton: 'Access Dashboard',
      dashboardTitle: 'Gig Management Hub',
      budgetStatus: 'Gig Budget Status',
      vettedContractors: 'Vetted Talent Directory',
      shiftsVerif: 'Shift Approval & Finance Checkout',
      contractorName: 'Talent Name',
      category: 'Category',
      meiStatus: 'MEI Tax Status',
      status: 'Status',
      actions: 'Actions',
      paid: 'Settled via PIX',
      disputed: 'Dispute',
      completed: 'Pending Payout',
      activeOnsite: 'On Stage',
      scheduled: 'Booked',
      payPix: 'Pay with PIX',
      adjustHours: 'Edit Hours',
      approvedHours: 'Approve',
      allEvents: 'All Events',
      budgetUsage: 'Spent Balance',
      budgetCap: 'Budget Cap',
      warningClose: 'Warning: Close to budget threshold!',
      filterAll: 'All Categories',
      vettedLabel: 'Vetted',
      unvettedLabel: 'Pending',
      contractorApp: 'GoIA Gig Contractor',
      activeShift: 'Today\'s Gig',
      checkInBtn: 'Clock In (GPS Verified)',
      checkOutBtn: 'Clock Out (Finish)',
      walletTitle: 'Direct Payout Wallet',
      balance: 'Available Funds',
      paidShifts: 'Settled Gigs',
      submitInvoice: 'Issue MEI Invoice',
      verifyLocation: 'Verifying location via GPS...',
      raiseDispute: 'Dispute Hours',
      sendDispute: 'Submit Dispute',
      disputeNotesPlaceholder: 'Explain the hours mismatch...',
      confirmCheckin: 'Confirm Clock-In',
      workingNow: 'Active on Stage',
      realtimeSync: 'GPS / PIX Synchronization Logger',
      webAction: 'Producer Action',
      mobileAction: 'Contractor Action',
      pixModalTitle: 'Direct PIX Payment',
      pixDesc: 'Scan the QR Code or copy the PIX Key to complete the bank settlement directly to the contractor\'s MEI account.',
      pixKeyCopy: 'Copy PIX Code',
      pixCopied: 'Key Copied!',
      pixConfirmBtn: 'Confirm Success Payment',
      pixStatusPaid: 'Settled D+0!',
      pixReceipt: 'PIX Settlement Receipt',
      receiptDate: 'Date/Time:',
      receiptId: 'Transaction E-ID:',
      receiptContractor: 'Beneficiary:',
      receiptCnpj: 'MEI Tax ID:',
      receiptAmount: 'Net Value:',
      close: 'Close',
      socialLogin: 'Or sign in with social networks',
      gpsRegion: 'Region:',
      filterProximity: 'Show nearby gigs only',
      mockGpsBtn: 'Change State'
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        events,
        contractors,
        shifts,
        activeEventId,
        setActiveEventId,
        selectedContractorId,
        setSelectedContractorId,
        notifications,
        addNotification,
        checkIn,
        checkOut,
        adjustAndApproveHours,
        openPixPayment,
        executePixPayment,
        pixModal,
        setPixModal,
        raiseDisputeMobile,
        gpsStatus,
        userLocation,
        requestGeolocation,
        mockLocation,
        proximityFilterEnabled,
        setProximityFilterEnabled,
        validAccessCodes,
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
        assignShiftToEvent,
        refreshAllData,
        updateContractor,
        updateEmployer,
        getDistanceInKm,
        preHireWithDeposit,
        currentUser,
        setCurrentUser,
        userRole,
        setUserRole,
        deleteUserAdmin,
        updateUserAdmin,
        deleteGroupAdmin,
        updateGroupAdmin,
        deleteOpportunityAdmin,
        updateOpportunityAdmin,
        sendEmailProposal,
        t: t[language]
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
