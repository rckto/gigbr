import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Mock initial seeds for High-Fidelity Memory Mode fallback
const initialEvents = [
  { id: 'evt-1', name: 'Carnaval de São Paulo - Anhembi', date: '2027-02-12', location: 'Sambódromo do Anhembi, São Paulo - SP', state: 'SP', latitude: -23.515, longitude: -46.638, budgetLimit: 120000, currentSpend: 84500, vesselStatus: 'Ativo', employer_id: 'emp-1', crowdfundGoal: 50000, crowdfundRaised: 12500 },
  { id: 'evt-2', name: 'Festival de Inverno - Campos do Jordão', date: '2027-07-15', location: 'Auditório Cláudio Santoro, Campos do Jordão - SP', state: 'SP', latitude: -22.739, longitude: -45.590, budgetLimit: 60000, currentSpend: 15400, vesselStatus: 'Ativo', employer_id: 'emp-1', crowdfundGoal: 30000, crowdfundRaised: 4200 },
  { id: 'evt-3', name: 'Festa de Peão de Barretos', date: '2027-08-20', location: 'Arena de Rodeios, Barretos - SP', state: 'SP', latitude: -20.559, longitude: -48.568, budgetLimit: 180000, currentSpend: 0, vesselStatus: 'Planejado', employer_id: 'admin-1', crowdfundGoal: 80000, crowdfundRaised: 0 },
  { id: 'evt-4', name: 'Show no Allianz Parque', date: '2026-09-05', location: 'Allianz Parque, São Paulo - SP', state: 'SP', latitude: -23.527, longitude: -46.678, budgetLimit: 95000, currentSpend: 93800, vesselStatus: 'Ativo', employer_id: 'emp-1', crowdfundGoal: 40000, crowdfundRaised: 39500 },
  { id: 'evt-5', name: 'Grande Show de Réveillon - Maracanã', date: '2026-12-31', location: 'Estádio do Maracanã, Rio de Janeiro - RJ', state: 'RJ', latitude: -22.912, longitude: -43.230, budgetLimit: 150000, currentSpend: 0, vesselStatus: 'Ativo', employer_id: 'emp-1', crowdfundGoal: 100000, crowdfundRaised: 0 },
  { id: 'evt-6', name: 'Festa Junina da Pampulha - BH', date: '2027-06-24', location: 'Lagoa da Pampulha, Belo Horizonte - MG', state: 'MG', latitude: -19.851, longitude: -43.979, budgetLimit: 50000, currentSpend: 0, vesselStatus: 'Ativo', employer_id: 'admin-1', crowdfundGoal: 20000, crowdfundRaised: 18500 }
];

const initialUsers = [
  { id: 'admin-1', name: 'Administrador Central', email: 'admin@gigbr.com.br', phone: '(11) 99999-9999', role: 'admin', is_vetted: 1, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', city: 'São Paulo', state: 'SP', rating: 5.0, completed_shifts: 0, bio: 'Diretor Geral da plataforma GIG BR.' },
  { id: 'emp-1', name: 'Roberto Marinho', email: 'roberto@globo.com.br', phone: '(21) 98888-8888', role: 'employer', is_vetted: 1, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face', city: 'Rio de Janeiro', state: 'RJ', rating: 5.0, completed_shifts: 0, bio: 'Produtor executivo de festivais de ópera e espetáculos artísticos de grande porte.' },
  { id: 'cont-1', name: 'Thiago Oliveira da Silva', email: 'thiago@gmail.com', phone: '(11) 98888-7777', role: 'freelancer', cpf: '345.***.***-89', cnpj: '45.678.901/0001-23', registration_type: 'PJ', omb: '', drt: 'DRT/ART 99318', bio: 'Técnico de áudio e iluminação especializado em consoles digitais, alinhamento de sistemas de P.A.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', city: 'São Paulo - SP', state: 'SP', is_vetted: 1, rating: 4.9, completed_shifts: 142 },
  { id: 'cont-2', name: 'Mariana Santos Souza', email: 'mariana@gmail.com', phone: '(11) 98888-7777', role: 'freelancer', cpf: '289.***.***-45', cnpj: '38.123.456/0001-78', registration_type: 'PJ', omb: '', drt: 'DRT/ART 99318', bio: 'Produtora técnica de camarins e receptivo de grandes festivais.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', city: 'São Paulo - SP', state: 'SP', is_vetted: 1, rating: 4.8, completed_shifts: 98 },
  { id: 'cont-3', name: 'Bruno Lima Ferreira', email: 'bruno@gmail.com', phone: '(11) 98888-7777', role: 'freelancer', cpf: '412.***.***-12', cnpj: '51.987.654/0001-09', registration_type: 'PJ', omb: 'OMB/SP 48312', drt: '', bio: 'Instrumentista profissional com sólida experiência em palcos de grande porte.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', city: 'São Paulo - SP', state: 'SP', is_vetted: 1, rating: 4.7, completed_shifts: 75 }
];

const initialGroups = [
  { id: 'group-1', name: 'Banda Filarmônica Municipal', category: 'Músicos', description: 'Orquestra de Sopros e Cordas para eventos oficiais do município.', city: 'São Paulo - SP', state: 'SP', leader_id: 'cont-3' }
];

const initialGroupMembers = [
  { group_id: 'group-1', user_id: 'cont-3' }
];

const initialOpportunities = [
  { id: 'job-1', title: 'Violinista de Concerto', category: 'Músicos', company: 'Produtora Marinho', payment: 'R$ 600.00', date: '2027-02-12', location: 'São Paulo - SP', lat: -23.5489, lng: -46.6388, description: 'Violinista para compor a orquestra sinfônica na abertura do festival.', status: 'Aberta', employer_id: 'emp-1', access_code: 'OP-1234' }
];

const initialShifts = [
  { id: 'shift-1', event_id: 'evt-1', contractor_id: 'cont-1', date: '2027-02-12', scheduled_hours: 8, actual_hours: 8.5, hourly_rate: 35.00, status: 'Finalizado', check_in_time: '18:02', check_out_time: '02:32', dispute_notes: '', invoice_emitted: 1 },
  { id: 'shift-2', event_id: 'evt-1', contractor_id: 'cont-3', date: '2027-02-12', scheduled_hours: 6, actual_hours: 6, hourly_rate: 80.00, status: 'Pago', check_in_time: '17:58', check_out_time: '00:02', dispute_notes: '', invoice_emitted: 1, pix_receipt_code: 'E123456789012345678901abcdefghij', paid_at: '2027-02-13 09:30', deposit_paid: 1, deposit_amount: 240.00 }
];

// Connection variables
let pool = null;
let useMySQL = false;

// Simulated Memory Database Store
const memoryDB = {
  events: [...initialEvents],
  users: [...initialUsers],
  groups: [...initialGroups],
  group_members: [...initialGroupMembers],
  opportunities: [...initialOpportunities],
  shifts: [...initialShifts]
};

// Export save memory database helper
export function saveMemoryDB() {
  if (useMySQL) return;
  try {
    const filePath = path.join(process.cwd(), 'server', 'db.json');
    fs.writeFileSync(filePath, JSON.stringify(memoryDB, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save memory database to db.json:', error.message);
  }
}

// Initialize DB Engine
export async function initializeDatabase() {
  const host = process.env.DB_HOST || '';
  const user = process.env.DB_USER || '';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || '';

  if (host && user && database) {
    try {
      console.log('Connecting to MySQL Database at', host);
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      // Ping check
      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database.');
      connection.release();
      useMySQL = true;

      // Table migrations for employer_id, crowdfund_goal, crowdfund_raised, description and pix_key on events
      try {
        await pool.query('ALTER TABLE events ADD COLUMN employer_id VARCHAR(50)');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE events ADD COLUMN crowdfund_goal DECIMAL(12,2) DEFAULT 0.00');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE events ADD COLUMN crowdfund_raised DECIMAL(12,2) DEFAULT 0.00');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE events ADD COLUMN description TEXT');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE events ADD COLUMN pix_key VARCHAR(150)');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE users ADD COLUMN pix_type VARCHAR(50)');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE users ADD COLUMN pix_key VARCHAR(150)');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE users ADD COLUMN password VARCHAR(255)');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE users MODIFY COLUMN avatar LONGTEXT');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE groups MODIFY COLUMN avatar LONGTEXT');
      } catch (err) {}
      try {
        await pool.query('ALTER TABLE users ADD COLUMN marketplace_url TEXT');
      } catch (err) {}
    } catch (error) {
      console.warn('MySQL connection failed. Falling back to High-Fidelity Memory Mode.');
      console.error(error.message);
      useMySQL = false;
    }
  } else {
    console.log('No MySQL environment variables detected. Starting in High-Fidelity Memory Mode.');
    useMySQL = false;
  }

  // Load memory database from JSON if it exists
  if (!useMySQL) {
    try {
      const filePath = path.join(process.cwd(), 'server', 'db.json');
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        if (parsed.events) memoryDB.events = parsed.events;
        if (parsed.users) memoryDB.users = parsed.users;
        if (parsed.groups) memoryDB.groups = parsed.groups;
        if (parsed.group_members) memoryDB.group_members = parsed.group_members;
        if (parsed.opportunities) memoryDB.opportunities = parsed.opportunities;
        if (parsed.shifts) memoryDB.shifts = parsed.shifts;
        console.log('Successfully loaded persistent memory database state from server/db.json');
      }
    } catch (error) {
      console.warn('Failed to load persistent memory state from db.json:', error.message);
    }
  }
}

// User DAO methods
export async function getUsers() {
  if (useMySQL) {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  }
  return memoryDB.users;
}

export async function getUserById(id) {
  if (useMySQL) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }
  return memoryDB.users.find(u => u.id === id) || null;
}

export async function getUserByEmail(email) {
  if (useMySQL) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }
  return memoryDB.users.find(u => u.email === email) || null;
}

export async function insertUser(user) {
  if (useMySQL) {
    const query = `
      INSERT INTO users (id, name, email, password, phone, role, cpf, cnpj, registration_type, omb, drt, bio, avatar, city, state, is_vetted, rating, completed_shifts, pix_type, pix_key, marketplace_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      user.id, user.name, user.email, user.password || '', user.phone || '', user.role || 'freelancer',
      user.cpf || '', user.cnpj || '', user.registrationType || user.registration_type || 'PF',
      user.omb || '', user.drt || '', user.bio || '', user.avatar || '',
      user.city || 'São Paulo', user.state || 'SP', user.is_vetted !== undefined ? user.is_vetted : 1,
      user.rating || 5.00, user.completed_shifts || 0,
      user.pixType || user.pix_type || '', user.pixKey || user.pix_key || '',
      user.marketplaceUrl || user.marketplace_url || ''
    ]);
  } else {
    memoryDB.users.push({
      ...user,
      password: user.password || '',
      registration_type: user.registrationType || user.registration_type || 'PF',
      pix_type: user.pixType || user.pix_type || '',
      pix_key: user.pixKey || user.pix_key || '',
      is_vetted: user.is_vetted !== undefined ? user.is_vetted : 1,
      rating: user.rating || 5.00,
      completed_shifts: user.completed_shifts || 0,
      marketplace_url: user.marketplaceUrl || user.marketplace_url || ''
    });
    saveMemoryDB();
  }
  return user;
}

export async function updateUser(id, data) {
  if (useMySQL) {
    const query = `
      UPDATE users SET 
        name = ?, role = ?, email = ?, password = COALESCE(NULLIF(?, ''), password), phone = ?, omb = ?, drt = ?, bio = ?, avatar = ?, 
        registration_type = ?, cpf = ?, cnpj = ?, pix_type = ?, pix_key = ?, city = ?, state = ?, is_vetted = ?, marketplace_url = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      data.name, data.role, data.email, data.password || '', data.phone || '', data.omb || '', data.drt || '', data.bio || '', data.avatar || '',
      data.registrationType || data.registration_type || 'PF', data.cpf || '', data.cnpj || '',
      data.pixType || data.pix_type || '', data.pixKey || data.pix_key || '',
      data.city || 'São Paulo', data.state || 'SP',
      data.is_vetted !== undefined ? data.is_vetted : 1,
      data.marketplaceUrl || data.marketplace_url || '',
      id
    ]);
  } else {
    const index = memoryDB.users.findIndex(u => u.id === id);
    if (index !== -1) {
      memoryDB.users[index] = {
        ...memoryDB.users[index],
        ...data,
        password: data.password || memoryDB.users[index].password || '',
        registration_type: data.registrationType || data.registration_type || memoryDB.users[index].registration_type || 'PF',
        pix_type: data.pixType || data.pix_type || memoryDB.users[index].pix_type || '',
        pix_key: data.pixKey || data.pix_key || memoryDB.users[index].pix_key || '',
        is_vetted: data.is_vetted !== undefined ? data.is_vetted : memoryDB.users[index].is_vetted
      };
      saveMemoryDB();
    }
  }
  return getUserById(id);
}

export async function deleteUser(id) {
  if (useMySQL) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  } else {
    memoryDB.users = memoryDB.users.filter(u => u.id !== id);
    saveMemoryDB();
  }
  return { status: 'success' };
}

// Groups DAO methods
export async function getGroups() {
  if (useMySQL) {
    const [rows] = await pool.query('SELECT * FROM groups');
    return rows;
  }
  return memoryDB.groups;
}

export async function insertGroup(group) {
  if (useMySQL) {
    const query = `
      INSERT INTO groups (id, name, category, description, city, state, leader_id, email, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      group.id, group.name, group.category, group.description, group.city, group.state, group.leader_id || '',
      group.email || '', group.avatar || ''
    ]);
  } else {
    memoryDB.groups.push(group);
    saveMemoryDB();
  }
  return group;
}

export async function updateGroup(id, data) {
  if (useMySQL) {
    const query = `
      UPDATE groups SET name = ?, category = ?, description = ?, city = ?, state = ?, email = ?, avatar = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      data.name, data.category, data.description, data.city, data.state, data.email, data.avatar, id
    ]);
  } else {
    const index = memoryDB.groups.findIndex(g => g.id === id);
    if (index !== -1) {
      memoryDB.groups[index] = {
        ...memoryDB.groups[index],
        ...data
      };
      saveMemoryDB();
    }
  }
  return getGroups().then(groups => groups.find(g => g.id === id));
}

export async function deleteGroup(id) {
  if (useMySQL) {
    await pool.query('DELETE FROM groups WHERE id = ?', [id]);
    await pool.query('DELETE FROM group_members WHERE group_id = ?', [id]);
  } else {
    memoryDB.groups = memoryDB.groups.filter(g => g.id !== id);
    memoryDB.group_members = memoryDB.group_members.filter(gm => gm.group_id !== id);
    saveMemoryDB();
  }
  return { status: 'success' };
}

export async function getGroupMembers(groupId) {
  if (useMySQL) {
    const [rows] = await pool.query(`
      SELECT u.* FROM users u 
      INNER JOIN group_members gm ON u.id = gm.user_id 
      WHERE gm.group_id = ?
    `, [groupId]);
    return rows;
  }
  const userIds = memoryDB.group_members.filter(gm => gm.group_id === groupId).map(gm => gm.user_id);
  return memoryDB.users.filter(u => userIds.includes(u.id));
}

export async function addGroupMember(groupId, userId) {
  if (useMySQL) {
    await pool.query('INSERT IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)', [groupId, userId]);
  } else {
    const exists = memoryDB.group_members.some(gm => gm.group_id === groupId && gm.user_id === userId);
    if (!exists) {
      memoryDB.group_members.push({ group_id: groupId, user_id: userId });
      saveMemoryDB();
    }
  }
  return { status: 'success' };
}

// Opportunities DAO methods
export async function getOpportunities() {
  if (useMySQL) {
    const [rows] = await pool.query('SELECT * FROM opportunities ORDER BY created_at DESC');
    return rows;
  }
  return memoryDB.opportunities;
}

export async function insertOpportunity(opp) {
  if (useMySQL) {
    const query = `
      INSERT INTO opportunities (id, title, category, company, payment, date, location, lat, lng, description, status, employer_id, access_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      opp.id, opp.title, opp.category, opp.company, opp.payment, opp.date, opp.location,
      opp.lat || -23.5489, opp.lng || -46.6388, opp.description, opp.status || 'Aberta', opp.employer_id, opp.access_code
    ]);
  } else {
    memoryDB.opportunities.unshift(opp);
    saveMemoryDB();
  }
  return opp;
}

export async function updateOpportunity(id, data) {
  if (useMySQL) {
    const query = `
      UPDATE opportunities SET title = ?, category = ?, payment = ?, date = ?, location = ?, description = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      data.title, data.category, data.payment, data.date, data.location, data.description, id
    ]);
  } else {
    const index = memoryDB.opportunities.findIndex(o => o.id === id);
    if (index !== -1) {
      memoryDB.opportunities[index] = {
        ...memoryDB.opportunities[index],
        ...data
      };
      saveMemoryDB();
    }
  }
  return getOpportunities().then(opps => opps.find(o => o.id === id));
}

export async function deleteOpportunity(id) {
  if (useMySQL) {
    await pool.query('DELETE FROM opportunities WHERE id = ?', [id]);
  } else {
    memoryDB.opportunities = memoryDB.opportunities.filter(o => o.id !== id);
    saveMemoryDB();
  }
  return { status: 'success' };
}

export async function cleanupOpportunities() {
  const limitDate = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);
  if (useMySQL) {
    await pool.query('DELETE FROM opportunities WHERE created_at < ?', [limitDate]);
  } else {
    memoryDB.opportunities = memoryDB.opportunities.filter(opp => {
      const createdTime = opp.created_at ? new Date(opp.created_at).getTime() : Date.now();
      return (Date.now() - createdTime) < 45 * 24 * 60 * 60 * 1000;
    });
    saveMemoryDB();
  }
}

export async function checkDuplicateUser(email, doc) {
  let allUsers = [];
  try {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT id, email, cpf, cnpj FROM users');
      allUsers = rows;
    } else {
      allUsers = memoryDB.users;
    }
  } catch (err) {
    console.error('Error fetching users for duplicate check:', err.message);
    allUsers = memoryDB.users || [];
  }

  const cleanDoc = (doc || '').replace(/[^\d]/g, '');
  const targetEmail = (email || '').trim().toLowerCase();
  
  return allUsers.some(u => {
    const emailMatch = u.email && targetEmail && u.email.trim().toLowerCase() === targetEmail;
    const cleanUserCpf = (u.cpf || '').replace(/[^\d]/g, '');
    const cleanUserCnpj = (u.cnpj || '').replace(/[^\d]/g, '');
    const docMatch = cleanDoc && (cleanUserCpf === cleanDoc || cleanUserCnpj === cleanDoc);
    return emailMatch || docMatch;
  });
}

// Shifts DAO methods
export async function getShifts() {
  if (useMySQL) {
    const [rows] = await pool.query('SELECT * FROM shifts');
    return rows;
  }
  return memoryDB.shifts;
}

export async function insertShift(shift) {
  if (useMySQL) {
    const query = `
      INSERT INTO shifts (id, event_id, contractor_id, date, scheduled_hours, actual_hours, hourly_rate, status, check_in_time, check_out_time, dispute_notes, invoice_emitted, deposit_paid, deposit_amount, deposit_confirmed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      shift.id, shift.eventId || shift.event_id, shift.contractorId || shift.contractor_id, shift.date,
      shift.scheduledHours || shift.scheduled_hours || 8.00, shift.actualHours || shift.actual_hours || null,
      shift.hourlyRate || shift.hourly_rate || 35.00, shift.status || 'Agendado',
      shift.checkInTime || shift.check_in_time || null, shift.checkOutTime || shift.check_out_time || null,
      shift.disputeNotes || shift.dispute_notes || '', shift.invoiceEmitted || shift.invoice_emitted ? 1 : 0,
      shift.depositPaid || shift.deposit_paid ? 1 : 0, shift.depositAmount || shift.deposit_amount || 0.00,
      shift.depositConfirmedAt || shift.deposit_confirmed_at || null
    ]);
  } else {
    memoryDB.shifts.push({
      ...shift,
      eventId: shift.eventId || shift.event_id,
      contractorId: shift.contractorId || shift.contractor_id,
      scheduledHours: shift.scheduledHours || shift.scheduled_hours || 8.00,
      actualHours: shift.actualHours || shift.actual_hours || null,
      hourlyRate: shift.hourlyRate || shift.hourly_rate || 35.00,
      invoiceEmitted: shift.invoiceEmitted || shift.invoice_emitted ? true : false,
      depositPaid: shift.depositPaid || shift.deposit_paid ? true : false
    });
    saveMemoryDB();
  }
  return shift;
}

export async function updateShift(id, data) {
  if (useMySQL) {
    const query = `
      UPDATE shifts SET 
        actual_hours = ?, status = ?, check_in_time = ?, check_out_time = ?, dispute_notes = ?, invoice_emitted = ?, deposit_paid = ?, deposit_amount = ?, paid_at = ?, pix_receipt_code = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      data.actualHours || data.actual_hours || null, data.status,
      data.checkInTime || data.check_in_time || null, data.checkOutTime || data.check_out_time || null,
      data.disputeNotes || data.dispute_notes || '', data.invoiceEmitted || data.invoice_emitted ? 1 : 0,
      data.depositPaid || data.deposit_paid ? 1 : 0, data.depositAmount || data.deposit_amount || 0.00,
      data.paidAt || data.paid_at || null, data.pixReceiptCode || data.pix_receipt_code || null, id
    ]);
  } else {
    const index = memoryDB.shifts.findIndex(s => s.id === id);
    if (index !== -1) {
      memoryDB.shifts[index] = {
        ...memoryDB.shifts[index],
        ...data,
        eventId: data.eventId || data.event_id || memoryDB.shifts[index].eventId,
        contractorId: data.contractorId || data.contractor_id || memoryDB.shifts[index].contractorId,
        actualHours: data.actualHours || data.actual_hours || memoryDB.shifts[index].actualHours,
        invoiceEmitted: data.invoiceEmitted !== undefined ? !!data.invoiceEmitted : memoryDB.shifts[index].invoiceEmitted,
        depositPaid: data.depositPaid !== undefined ? !!data.depositPaid : memoryDB.shifts[index].depositPaid
      };
      saveMemoryDB();
    }
  }
  return getShifts().then(shifts => shifts.find(s => s.id === id));
}

// Events DAO methods
export async function getEvents() {
  if (useMySQL) {
    const [rows] = await pool.query('SELECT * FROM events');
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      date: r.date,
      location: r.location,
      state: r.state,
      latitude: parseFloat(r.latitude || -23.5489),
      longitude: parseFloat(r.longitude || -46.6388),
      budgetLimit: parseFloat(r.budget_limit || r.budgetLimit || 0),
      currentSpend: parseFloat(r.current_spend || r.currentSpend || 0),
      vesselStatus: r.vessel_status || r.vesselStatus || 'Ativo',
      employer_id: r.employer_id || r.employerId || '',
      crowdfundGoal: parseFloat(r.crowdfund_goal || r.crowdfundGoal || 0),
      crowdfundRaised: parseFloat(r.crowdfund_raised || r.crowdfundRaised || 0),
      description: r.description || '',
      pixKey: r.pix_key || r.pixKey || ''
    }));
  }
  return memoryDB.events;
}

export async function updateEventSpend(id, currentSpend) {
  if (useMySQL) {
    await pool.query('UPDATE events SET current_spend = ? WHERE id = ?', [currentSpend, id]);
  } else {
    const index = memoryDB.events.findIndex(e => e.id === id);
    if (index !== -1) {
      memoryDB.events[index].currentSpend = currentSpend;
      saveMemoryDB();
    }
  }
  return getEvents().then(events => events.find(e => e.id === id));
}

export async function insertEvent(event) {
  const newEvent = {
    id: event.id,
    name: event.name,
    date: event.date,
    location: event.location,
    state: event.state || 'SP',
    latitude: event.latitude || -23.5489,
    longitude: event.longitude || -46.6388,
    budgetLimit: parseFloat(event.budgetLimit || event.budget_limit || 0),
    currentSpend: parseFloat(event.currentSpend || event.current_spend || 0),
    vesselStatus: event.vesselStatus || event.vessel_status || 'Ativo',
    employer_id: event.employer_id || event.employerId || '',
    crowdfundGoal: parseFloat(event.crowdfundGoal || event.crowdfund_goal || 0),
    crowdfundRaised: parseFloat(event.crowdfundRaised || event.crowdfund_raised || 0),
    description: event.description || '',
    pixKey: event.pixKey || event.pix_key || ''
  };

  if (useMySQL) {
    const query = `
      INSERT INTO events (id, name, date, location, state, latitude, longitude, budget_limit, current_spend, vessel_status, employer_id, crowdfund_goal, crowdfund_raised, description, pix_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      newEvent.id, newEvent.name, newEvent.date, newEvent.location, newEvent.state,
      newEvent.latitude, newEvent.longitude, newEvent.budgetLimit, newEvent.currentSpend,
      newEvent.vesselStatus, newEvent.employer_id, newEvent.crowdfundGoal, newEvent.crowdfundRaised,
      newEvent.description, newEvent.pixKey
    ]);
  } else {
    memoryDB.events.push(newEvent);
    saveMemoryDB();
  }
  return newEvent;
}

export async function updateEvent(id, data) {
  if (useMySQL) {
    const query = `
      UPDATE events SET 
        name = ?, date = ?, location = ?, budget_limit = ?, vessel_status = ?, crowdfund_goal = ?, crowdfund_raised = ?, description = ?, pix_key = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      data.name, data.date, data.location,
      parseFloat(data.budgetLimit || data.budget_limit || 0),
      data.vesselStatus || data.vessel_status || 'Ativo',
      parseFloat(data.crowdfundGoal || data.crowdfund_goal || 0),
      parseFloat(data.crowdfundRaised || data.crowdfund_raised || 0),
      data.description !== undefined ? data.description : '',
      data.pixKey !== undefined ? data.pixKey : (data.pix_key || ''),
      id
    ]);
  } else {
    const index = memoryDB.events.findIndex(e => e.id === id);
    if (index !== -1) {
      memoryDB.events[index] = {
        ...memoryDB.events[index],
        name: data.name !== undefined ? data.name : memoryDB.events[index].name,
        date: data.date !== undefined ? data.date : memoryDB.events[index].date,
        location: data.location !== undefined ? data.location : memoryDB.events[index].location,
        budgetLimit: data.budgetLimit !== undefined ? parseFloat(data.budgetLimit) : memoryDB.events[index].budgetLimit,
        vesselStatus: data.vesselStatus !== undefined ? data.vesselStatus : memoryDB.events[index].vesselStatus,
        crowdfundGoal: data.crowdfundGoal !== undefined ? parseFloat(data.crowdfundGoal) : memoryDB.events[index].crowdfundGoal,
        crowdfundRaised: data.crowdfundRaised !== undefined ? parseFloat(data.crowdfundRaised) : memoryDB.events[index].crowdfundRaised,
        description: data.description !== undefined ? data.description : memoryDB.events[index].description,
        pixKey: data.pixKey !== undefined ? data.pixKey : (data.pix_key || memoryDB.events[index].pixKey)
      };
      saveMemoryDB();
    }
  }
  return getEvents().then(events => events.find(e => e.id === id));
}

export async function deleteEvent(id) {
  if (useMySQL) {
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
  } else {
    memoryDB.events = memoryDB.events.filter(e => e.id !== id);
    saveMemoryDB();
  }
  return { status: 'success' };
}
