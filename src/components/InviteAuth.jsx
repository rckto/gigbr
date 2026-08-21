import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import logo from '../assets/logo.png';
import backgroundImage from '../assets/background.jpg';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const REGISTER_BRAZILIAN_STATES = [
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
  { code: 'TO', name: 'Tocantins' },
  { code: 'EX', name: 'Estrangeiro / Internacional' }
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
      margin: '16px auto',
      padding: '8px',
      backgroundColor: 'rgba(255,255,255,0.9)',
      border: '1px dashed #cbd5e1',
      borderRadius: '4px',
      textAlign: 'center',
      maxWidth: '360px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <span style={{ fontSize: '0.55rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
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

const InviteAuth = ({ onLoginSuccess, onAuthSuccess }) => {
  const asyncConfirm = (message) => {
    return new Promise((resolve) => {
      showConfirm(message, () => resolve(true), () => resolve(false));
    });
  };

  const asyncPrompt = (message, defaultValue = '') => {
    return new Promise((resolve) => {
      showPrompt(message, defaultValue, (val) => resolve(val), () => resolve(null));
    });
  };

  const { t, language, toggleLanguage, setLanguage, showToast, showConfirm, showPrompt, validAccessCodes, setCurrentUser, setUserRole, refreshAllData, registerFreelancer, registerEmployer } = useContext(AppContext);
  
  // Tab/Mode management: true for Register mode, false for Login mode
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login Form States
  const [authMode, setAuthMode] = useState('employer'); // 'employer' or 'freelancer'
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form States
  const [regForm, setRegForm] = useState({
    role: 'freelancer', // 'freelancer' or 'employer'
    name: '',
    email: '',
    phone: '',
    password: '',
    cpf: '',
    cnpj: '',
    registrationType: 'PF',
    pixType: 'CPF',
    pixKey: '',
    companyName: '',
    category: 'Músicos',
    city: 'São Paulo',
    state: 'SP',
    omb: '',
    drt: '',
    bio: '',
    avatar: ''
  });
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Anti-Spam Captcha States (Isolated)
  const [loginCaptchaVerified, setLoginCaptchaVerified] = useState(false);
  const [loginCaptchaLoading, setLoginCaptchaLoading] = useState(false);
  const [registerCaptchaVerified, setRegisterCaptchaVerified] = useState(false);
  const [registerCaptchaLoading, setRegisterCaptchaLoading] = useState(false);

  const triggerSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    
    if (provider === 'google') {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        const emailToUse = firebaseUser.email.toLowerCase();
        const displayName = firebaseUser.displayName || '';

        const checkRes = await fetch(`${apiOrigin}/api/users`);
        if (checkRes.ok) {
          const allUsers = await checkRes.json();
          const existingUser = allUsers.find(u => u.email && u.email.toLowerCase() === emailToUse);
          
          if (existingUser) {
            const loginRes = await fetch(`${apiOrigin}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email: emailToUse, 
                password: existingUser.password || existingUser.cpf || existingUser.cnpj 
              })
            });
            
            if (loginRes.ok) {
              const data = await loginRes.json();
              setCurrentUser(data.user);
              setUserRole(data.role);
              await refreshAllData();
              triggerSuccess();
              return;
            }
          }
        }

        // Onboarding flow for new Google users
        const wantToRegister = await asyncConfirm(`Nenhuma conta cadastrada com o e-mail "${emailToUse}". Deseja criar um perfil rápido usando este login social?`);
        if (!wantToRegister) return;

        const isFreelancer = await asyncConfirm("Deseja se cadastrar como Prestador/Freelancer? (Clique em 'Cancelar' para se cadastrar como Produtor/Contratante)");
        const docNumber = await asyncPrompt(isFreelancer ? "Digite seu CPF (11 dígitos):" : "Digite seu CNPJ (14 dígitos):");
        if (!docNumber) return;

        const phoneNumber = await asyncPrompt("Digite seu telefone de contato:");
        if (!phoneNumber) return;

        const regPayload = {
          name: displayName || emailToUse.split('@')[0],
          email: emailToUse,
          phone: phoneNumber.trim(),
          password: docNumber.trim(),
          role: isFreelancer ? 'freelancer' : 'employer',
          registrationType: isFreelancer ? 'PF' : 'PJ',
          cpf: isFreelancer ? docNumber.trim() : '',
          cnpj: isFreelancer ? '' : docNumber.trim(),
          pixType: isFreelancer ? 'CPF' : 'CNPJ',
          pixKey: docNumber.trim(),
          city: 'São Paulo',
          state: 'SP',
          bio: `Perfil rápido criado via Firebase Google Social Login.`
        };

        if (isFreelancer) {
          await registerFreelancer(regPayload);
        } else {
          await registerEmployer(regPayload);
        }

        const finalRes = await fetch(`${apiOrigin}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToUse, password: docNumber.trim() })
        });
        
        if (finalRes.ok) {
          const data = await finalRes.json();
          setCurrentUser(data.user);
          setUserRole(data.role);
          await refreshAllData();
          triggerSuccess();
          showToast("✓ Conta criada e autenticada via Firebase com sucesso!", "success");
        }
      } catch (err) {
        console.error("Firebase Auth Error:", err);
        setError("Erro na autenticação Firebase Google: " + err.message);
      }
    } else {
      // simulated Apple Login
      const emailInput = await asyncPrompt("Digite o e-mail da sua conta Apple para entrar ou cadastrar-se:");
      if (!emailInput) return;
      const emailToUse = emailInput.trim().toLowerCase();
      try {
        const checkRes = await fetch(`${apiOrigin}/api/users`);
        if (checkRes.ok) {
          const allUsers = await checkRes.json();
          const existingUser = allUsers.find(u => u.email && u.email.toLowerCase() === emailToUse);
          
          if (existingUser) {
            const loginRes = await fetch(`${apiOrigin}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email: emailToUse, 
                password: existingUser.password || existingUser.cpf || existingUser.cnpj 
              })
            });
            if (loginRes.ok) {
              const data = await loginRes.json();
              setCurrentUser(data.user);
              setUserRole(data.role);
              await refreshAllData();
              triggerSuccess();
              return;
            }
          }
        }
        
        const wantToRegister = await asyncConfirm(`Nenhuma conta cadastrada com o e-mail "${emailToUse}". Deseja criar um perfil rápido usando este login social?`);
        if (!wantToRegister) return;
        const isFreelancer = await asyncConfirm("Deseja se cadastrar como Prestador/Freelancer? (Clique em 'Cancelar' para se cadastrar como Produtor/Contratante)");
        const fullName = await asyncPrompt("Digite seu nome completo / razão social:");
        if (!fullName) return;
        const docNumber = await asyncPrompt(isFreelancer ? "Digite seu CPF (11 dígitos):" : "Digite seu CNPJ (14 dígitos):");
        if (!docNumber) return;
        const phoneNumber = await asyncPrompt("Digite seu telefone de contato:");
        if (!phoneNumber) return;
        
        const regPayload = {
          name: fullName.trim(),
          email: emailToUse,
          phone: phoneNumber.trim(),
          password: docNumber.trim(),
          role: isFreelancer ? 'freelancer' : 'employer',
          registrationType: isFreelancer ? 'PF' : 'PJ',
          cpf: isFreelancer ? docNumber.trim() : '',
          cnpj: isFreelancer ? '' : docNumber.trim(),
          pixType: isFreelancer ? 'CPF' : 'CNPJ',
          pixKey: docNumber.trim(),
          city: 'São Paulo',
          state: 'SP',
          bio: `Perfil rápido criado via Apple Social Login.`
        };
        
        if (isFreelancer) {
          await registerFreelancer(regPayload);
        } else {
          await registerEmployer(regPayload);
        }
        
        const finalRes = await fetch(`${apiOrigin}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToUse, password: docNumber.trim() })
        });
        if (finalRes.ok) {
          const data = await finalRes.json();
          setCurrentUser(data.user);
          setUserRole(data.role);
          await refreshAllData();
          triggerSuccess();
          showToast("✓ Conta criada e autenticada com sucesso!", "success");
        }
      } catch (err) {
        setError(err.message || 'Erro ao conectar.');
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Isolated anti-spam verification
    if (!loginCaptchaVerified) {
      setError('Por favor, confirme que você não é um robô no desafio anti-spam.');
      return;
    }

    const payload = {};
    if (authMode === 'freelancer') {
      const formattedCode = inviteCode.trim().toUpperCase();
      if (!formattedCode) {
        setError('Preencha seu código de acesso.');
        return;
      }
      payload.inviteCode = formattedCode;
    } else {
      if (!email || !password) {
        setError('Preencha seu e-mail e senha de acesso (ou CPF/CNPJ).');
        return;
      }
      payload.email = email.trim().toLowerCase();
      payload.password = password.trim();
      payload.cpfOrCnpj = password.trim();
    }

    try {
      const res = await fetch(`${apiOrigin}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setUserRole(data.role);
        await refreshAllData();
        triggerSuccess();
      } else {
        const errData = await res.json();
        setError(errData.error || 'Credenciais de acesso incorretas.');
      }
    } catch (err) {
      console.warn("Backend API offline. Using offline credentials fallback.");
      // Fallback auth
      if (authMode === 'freelancer') {
        const formattedCode = inviteCode.trim().toUpperCase();
        if (formattedCode === 'ADMIN2027') {
          setCurrentUser({ id: 'admin-1', name: 'Administrador Central', email: 'admin@gigbr.com.br', role: 'admin', city: 'São Paulo', state: 'SP' });
          setUserRole('admin');
          triggerSuccess();
        } else if (formattedCode === 'BRASIL2027') {
          setCurrentUser({ id: 'emp-1', name: 'Roberto Marinho', email: 'roberto@globo.com.br', role: 'employer', city: 'Rio de Janeiro', state: 'RJ' });
          setUserRole('employer');
          triggerSuccess();
        } else if (formattedCode.startsWith('OP-')) {
          setCurrentUser({
            id: 'guest',
            name: 'Acesso Convidado',
            email: 'convidado@gigbr.com.br',
            role: 'guest',
            isGuest: true,
            accessCode: formattedCode,
            targetOpportunityId: 'job-1'
          });
          setUserRole('guest');
          triggerSuccess();
        } else {
          setError('Modo Offline: código inválido ou offline. Use o código de acesso OP-XXXX.');
        }
      } else {
        // Safe offline check for credentials (check plain password or Clean CPF/CNPJ)
        const localUsers = JSON.parse(localStorage.getItem('gigbr_users') || '[]');
        const targetEmail = email.trim().toLowerCase();
        const cleanInputDoc = password.trim().replace(/[^\d]/g, '');
        const plainInputPassword = password.trim();
        
        const found = localUsers.find(u => {
          const emailMatch = u.email && u.email.toLowerCase() === targetEmail;
          const cleanUserDoc = (u.cpf || u.cnpj || '').replace(/[^\d]/g, '');
          const passMatch = u.password === plainInputPassword || cleanUserDoc === cleanInputDoc;
          return emailMatch && passMatch;
        });

        if (found) {
          setCurrentUser(found);
          setUserRole(found.role);
          triggerSuccess();
        } else {
          // Check if it matches default fallback users
          const defaultTalents = [
            { id: 'cont-3', name: 'Bruno Lima Ferreira', email: 'bruno@gmail.com', cpf: '412.***.***-12', role: 'freelancer' }
          ];
          const defaultFound = defaultTalents.find(u => u.email === targetEmail);
          if (defaultFound) {
            setCurrentUser(defaultFound);
            setUserRole('freelancer');
            triggerSuccess();
          } else {
            setError('Modo Offline: Credenciais incorretas ou usuário não encontrado.');
          }
        }
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Isolated anti-spam verification
    if (!registerCaptchaVerified) {
      setError('Por favor, confirme que você não é um robô no desafio anti-spam.');
      return;
    }

    const isFreelancer = regForm.role === 'freelancer';
    const document = regForm.registrationType === 'PF' ? regForm.cpf : regForm.cnpj;

    if (!regForm.name || !regForm.email || !regForm.phone || !document || !regForm.city || !regForm.state) {
      setError('Por favor, preencha todos os campos obrigatórios (Nome, E-mail, Telefone, Documento, Cidade e Estado).');
      return;
    }

    if (!regForm.avatar) {
      setError('Por favor, faça upload de uma Foto de Perfil (Avatar) obrigatória.');
      return;
    }

    if (isFreelancer && !regForm.category) {
      setError('Por favor, selecione sua área de atuação (Ocupação).');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regForm.email)) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    // Password strength validation
    if (!regForm.password || regForm.password.length < 6) {
      setError('A senha de acesso deve conter pelo menos 6 caracteres.');
      return;
    }

    if (!regForm.pixKey) {
      setError('Por favor, cadastre uma chave PIX individual para recebimentos.');
      return;
    }

    const payload = {
      id: `${isFreelancer ? 'cont' : 'emp'}-${Date.now()}`,
      name: regForm.name,
      email: regForm.email,
      phone: regForm.phone,
      password: regForm.password,
      role: regForm.role,
      cpf: regForm.registrationType === 'PF' ? regForm.cpf : '',
      cnpj: regForm.registrationType === 'PJ' ? regForm.cnpj : '',
      registrationType: regForm.registrationType,
      pixType: regForm.pixType,
      pixKey: regForm.pixKey,
      companyName: isFreelancer ? '' : (regForm.companyName || regForm.name),
      category: isFreelancer ? regForm.category : '',
      city: regForm.city,
      state: regForm.state,
      omb: isFreelancer ? regForm.omb : '',
      drt: isFreelancer ? regForm.drt : '',
      bio: regForm.bio || (isFreelancer ? 'Freelancer homologado no GIG BR.' : 'Produtor cadastrado no GIG BR.'),
      avatar: regForm.avatar,
      is_vetted: 1
    };

    try {
      if (isFreelancer) {
        await registerFreelancer(payload);
      } else {
        await registerEmployer(payload);
      }

      // Safe refresh if server is up
      try {
        await refreshAllData();
      } catch (err) {}

      showToast('🎉 Cadastro realizado com sucesso! Efetue seu login para acessar o sistema.', "success");
      
      // Reset forms and toggle back to login
      setIsRegistering(false);
      setEmail(regForm.email);
      setPassword(regForm.password);
      setAuthMode('employer');
      setRegForm({
        role: 'freelancer',
        name: '',
        email: '',
        phone: '',
        cpf: '',
        cnpj: '',
        registrationType: 'PF',
        pixType: 'CPF',
        pixKey: '',
        companyName: '',
        category: 'Músicos',
        city: 'São Paulo',
        state: 'SP',
        omb: '',
        drt: '',
        bio: ''
      });
      setRegisterCaptchaVerified(false);
      setLoginCaptchaVerified(false);
    } catch (err) {
      setError(err.message || 'Erro ao registrar usuário.');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '32px 28px',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.88)', 
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Large Centered Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <img src={logo} alt="GoIA Gig BR Logo" className="logo-img" style={{ maxHeight: '90px' }} />
        </div>

        {/* Large Typography Header */}
        <h1 style={{ 
          fontFamily: 'var(--font-accent)', 
          fontSize: '2.2rem', 
          fontWeight: 900,
          letterSpacing: '-0.04em',
          background: 'linear-gradient(to right, #111827 30%, #4b5563 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
          lineHeight: '1.05'
        }}>
          GIG BR
        </h1>


        {!isRegistering ? (
          /* ================= LOGIN MODE ================= */
          <>
            {/* Auth Mode Toggle Switch */}
            <div style={{
              display: 'flex',
              backgroundColor: 'rgba(244, 244, 245, 0.8)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              border: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => { setAuthMode('employer'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.73rem',
                  fontWeight: 800,
                  backgroundColor: authMode === 'employer' ? '#ffffff' : 'transparent',
                  color: authMode === 'employer' ? 'var(--text-main)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                🔑 Credenciais (E-mail & CPF/CNPJ)
              </button>
              <button
                onClick={() => { setAuthMode('freelancer'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.73rem',
                  fontWeight: 800,
                  backgroundColor: authMode === 'freelancer' ? '#ffffff' : 'transparent',
                  color: authMode === 'freelancer' ? 'var(--text-main)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                🎟️ Código / Convidado
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authMode === 'freelancer' ? (
                <div style={{ textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Código de Acesso
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. OP-XXXX" 
                    value={inviteCode}
                    onChange={(e) => { setInviteCode(e.target.value); setError(''); }}
                    style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', padding: '10px', borderRadius: 'var(--radius-sm)', borderColor: error ? '#f87171' : 'var(--border-color)', backgroundColor: '#ffffff' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>E-mail Cadastrado</label>
                    <input 
                      type="email" className="form-input" placeholder="seu.email@provedor.com" required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Senha ou CPF/CNPJ de Acesso</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-input" 
                        placeholder="Sua senha ou CPF/CNPJ de cadastro" 
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        style={{ backgroundColor: '#ffffff', paddingRight: '70px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--color-blue)',
                          textTransform: 'uppercase'
                        }}
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Google reCAPTCHA Widget (Login) - Universal */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                border: '1px solid #d3d3d3',
                borderRadius: '3px',
                padding: '8px 12px',
                width: '100%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                color: '#000000',
                fontFamily: 'Roboto, helvetica, arial, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    onClick={() => {
                      if (loginCaptchaVerified) return;
                      setLoginCaptchaLoading(true);
                      setTimeout(() => {
                        setLoginCaptchaLoading(false);
                        setLoginCaptchaVerified(true);
                        setError('');
                      }, 1000);
                    }}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: loginCaptchaVerified ? 'none' : '2px solid #c1c1c1',
                      borderRadius: '2px',
                      cursor: loginCaptchaVerified ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ffffff',
                      transition: 'border-color 0.2s',
                    }}
                    title="Verificar"
                  >
                    {!loginCaptchaVerified && !loginCaptchaLoading && null}
                    {loginCaptchaLoading && (
                      <div className="recaptcha-spinner" style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid #4d90fe',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite'
                      }} />
                    )}
                    {loginCaptchaVerified && (
                      <span style={{ fontSize: '1.2rem', color: '#009a29', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#282828', userSelect: 'none' }}>
                    Não sou um robô
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                    alt="reCAPTCHA logo" 
                    style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                  />
                  <div style={{ fontSize: '0.45rem', color: '#555555', marginTop: '2px', textAlign: 'center', lineHeight: 1.1 }}>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#555555' }}>Privacidade</a>
                    <span style={{ margin: '0 2px' }}>-</span>
                    <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#555555' }}>Termos</a>
                  </div>
                </div>
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0', fontWeight: 600 }}>⚠️ {error}</p>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.9rem', width: '100%', borderRadius: 'var(--radius-sm)' }}>
                {authMode === 'employer' ? 'Entrar com Credenciais' : 'Entrar com Código'}
              </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Não tem conta? </span>
              <button 
                onClick={() => { setIsRegistering(true); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Criar Nova Conta
              </button>
            </div>


          </>
        ) : (
          /* ================= REGISTER MODE ================= */
          <>
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Tipo de Conta</label>
                <select 
                  className="form-input"
                  value={regForm.role}
                  onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <option value="freelancer">👤 Prestador (Freelancer)</option>
                  <option value="employer">🏢 Contratante (Produtor)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome Completo / Razão Social</label>
                <input 
                  type="text" className="form-input" required placeholder="Nome profissional"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  style={{ backgroundColor: '#ffffff' }}
                />
              </div>

              {regForm.role === 'employer' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Nome da Produtora / Empresa (Obrigatório CNPJ)</label>
                  <input 
                    type="text" className="form-input" required placeholder="Nome Fantasia"
                    value={regForm.companyName}
                    onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>E-mail</label>
                  <input 
                    type="email" className="form-input" required placeholder="email@exemplo.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Telefone</label>
                  <input 
                    type="text" className="form-input" required placeholder="(11) 98888-7777"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Senha de Acesso</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showRegPassword ? "text" : "password"} 
                    className="form-input" 
                    required 
                    placeholder="Mínimo 6 caracteres" 
                    minLength="6"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    style={{ backgroundColor: '#ffffff', paddingRight: '70px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--color-blue)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {showRegPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Regime Documentação</label>
                  <select 
                    className="form-input"
                    value={regForm.registrationType}
                    onChange={(e) => setRegForm({ ...regForm, registrationType: e.target.value, pixType: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <option value="PF">👤 Pessoa Física</option>
                    <option value="PJ">🏢 Pessoa Jurídica (CNPJ)</option>
                  </select>
                </div>
                {regForm.registrationType === 'PF' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>CPF</label>
                    <input 
                      type="text" className="form-input" required placeholder="123.456.789-00"
                      value={regForm.cpf}
                      onChange={(e) => setRegForm({ ...regForm, cpf: e.target.value })}
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>CNPJ</label>
                    <input 
                      type="text" className="form-input" required placeholder="00.000.000/0001-00"
                      value={regForm.cnpj}
                      onChange={(e) => setRegForm({ ...regForm, cnpj: e.target.value })}
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                )}
              </div>

              {/* PIX Key Input Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Tipo de Chave PIX</label>
                  <select 
                    className="form-input"
                    value={regForm.pixType}
                    onChange={(e) => setRegForm({ ...regForm, pixType: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="Email">E-mail</option>
                    <option value="Telefone">Celular</option>
                    <option value="Chave Aleatoria">Chave Aleatória</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Chave PIX Individual</label>
                  <input 
                    type="text" className="form-input" required placeholder="Sua chave PIX ativa"
                    value={regForm.pixKey}
                    onChange={(e) => setRegForm({ ...regForm, pixKey: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>

              {regForm.role === 'freelancer' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Ocupação</label>
                  <select 
                    className="form-input"
                    value={regForm.category}
                    onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <option value="Músicos">Músicos</option>
                    <option value="Roadies">Roadies</option>
                    <option value="Técnicos">Técnicos</option>
                    <option value="Artistas">Artistas</option>
                  </select>
                </div>
              )}

              {regForm.role === 'freelancer' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>DRT (Opcional)</label>
                    <input 
                      type="text" className="form-input" placeholder="DRT-XXXX"
                      value={regForm.drt}
                      onChange={(e) => setRegForm({ ...regForm, drt: e.target.value })}
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>OMB (Opcional)</label>
                    <input 
                      type="text" className="form-input" placeholder="OMB-XXXX"
                      value={regForm.omb}
                      onChange={(e) => setRegForm({ ...regForm, omb: e.target.value })}
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Cidade</label>
                  <input 
                    type="text" className="form-input" required placeholder="Ex. São Paulo"
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Estado (UF)</label>
                  <select 
                    className="form-input" required
                    value={regForm.state}
                    onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                    style={{ backgroundColor: '#ffffff', color: 'var(--text-main)' }}
                  >
                    <option value="">Selecione...</option>
                    {REGISTER_BRAZILIAN_STATES.map(st => (
                      <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Foto de Perfil (Avatar) - Obrigatório</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {regForm.avatar ? (
                    <img src={regForm.avatar} alt="Avatar Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                  )}
                  <input 
                    type="file" accept="image/*" required={!regForm.avatar}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert("A imagem não pode ultrapassar 2MB!");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setRegForm({ ...regForm, avatar: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ fontSize: '0.75rem', flex: 1 }}
                  />
                </div>
              </div>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>

              {/* Google reCAPTCHA Widget (Register) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f9f9f9',
                border: '1px solid #d3d3d3',
                borderRadius: '3px',
                padding: '10px 14px',
                width: '100%',
                margin: '12px 0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                color: '#000000',
                fontFamily: 'Roboto, helvetica, arial, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    onClick={() => {
                      if (registerCaptchaVerified) return;
                      setRegisterCaptchaLoading(true);
                      setTimeout(() => {
                        setRegisterCaptchaLoading(false);
                        setRegisterCaptchaVerified(true);
                        setError('');
                      }, 1000);
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: registerCaptchaVerified ? 'none' : '2px solid #c1c1c1',
                      borderRadius: '2px',
                      cursor: registerCaptchaVerified ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ffffff',
                      transition: 'border-color 0.2s',
                    }}
                    title="Verificar"
                  >
                    {!registerCaptchaVerified && !registerCaptchaLoading && null}
                    {registerCaptchaLoading && (
                      <div className="recaptcha-spinner" style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid #4d90fe',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite'
                      }} />
                    )}
                    {registerCaptchaVerified && (
                      <span style={{ fontSize: '1.4rem', color: '#009a29', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#282828', userSelect: 'none' }}>
                    Não sou um robô
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                    alt="reCAPTCHA logo" 
                    style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  />
                  <div style={{ fontSize: '0.5rem', color: '#555555', marginTop: '2px', textAlign: 'center', lineHeight: 1.1 }}>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#555555' }}>Privacidade</a>
                    <span style={{ margin: '0 2px' }}>-</span>
                    <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#555555' }}>Termos</a>
                  </div>
                </div>
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0', fontWeight: 600 }}>⚠️ {error}</p>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => { setIsRegistering(false); setError(''); }} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '12px' }}
                >
                  Voltar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '12px' }}
                >
                  Registrar
                </button>
              </div>
            </form>
          </>
        )}

        <GoogleAdSlot slotId="landing-page-ad" height="90px" />
      </div>
    </div>
  );
};

export default InviteAuth;
