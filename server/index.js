import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Load local environment variables from .env if present
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val.trim();
      }
    });
  }
} catch (err) {
  console.warn('Could not load .env file:', err.message);
}

import { 
  initializeDatabase,
  getUsers,
  getUserById,
  getUserByEmail,
  insertUser,
  updateUser,
  deleteUser,
  getGroups,
  insertGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  addGroupMember,
  getOpportunities,
  insertOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getShifts,
  insertShift,
  updateShift,
  getEvents,
  insertEvent,
  updateEventSpend,
  updateEvent,
  deleteEvent,
  checkDuplicateUser,
  cleanupOpportunities
} from './db.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

let smtpTransporter;

async function initializeSMTP() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log(`[SMTP] Configured real SMTP server at ${process.env.SMTP_HOST}`);
  } else {
    // Fallback to real Ethereal SMTP test account
    try {
      const testAccount = await nodemailer.createTestAccount();
      smtpTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[SMTP] Configured Ethereal Test SMTP credentials:`);
      console.log(`  User: ${testAccount.user}`);
      console.log(`  Pass: ${testAccount.pass}`);
    } catch (error) {
      console.warn('[SMTP] Could not create Ethereal account, falling back to mock logs:', error.message);
    }
  }
}

initializeSMTP();

const PORT = process.env.PORT || 3001;

// Seed a default admin on startup
async function seedDefaultAdmin() {
  const users = await getUsers();
  const adminExists = users.some(u => u.role === 'admin');
  if (!adminExists) {
    await insertUser({
      id: 'admin-1',
      name: 'Administrador Central',
      email: 'admin@gigbr.com.br',
      phone: '(11) 99999-9999',
      role: 'admin',
      is_vetted: 1,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      city: 'São Paulo',
      state: 'SP',
      rating: 5.0,
      completed_shifts: 0,
      bio: 'Diretor Geral da plataforma GIG BR.'
    });
    console.log('Seeded default administrator account.');
  }
}

// 1. Auth Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { inviteCode, email, cpfOrCnpj, password } = req.body;

  try {
    // A. Admin Login Code or Email
    if (inviteCode === 'ADMIN2027' || email === 'admin@gigbr.com.br') {
      let admin = await getUserByEmail('admin@gigbr.com.br');
      if (!admin) {
        await seedDefaultAdmin();
        admin = await getUserByEmail('admin@gigbr.com.br');
      }
      return res.json({ success: true, role: 'admin', user: admin });
    }

    // B. Employer & Guest Access Code Login (Default or Generated OP-XXXX)
    if (inviteCode) {
      const upperCode = inviteCode.trim().toUpperCase();
      if (upperCode === 'BRASIL2027') {
        // Retrieve or seed an employer account
        let employer = await getUserByEmail('roberto@globo.com.br');
        if (!employer) {
          employer = await insertUser({
            id: 'emp-1',
            name: 'Roberto Marinho',
            email: 'roberto@globo.com.br',
            phone: '(21) 98888-8888',
            role: 'employer',
            is_vetted: 1,
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
            city: 'Rio de Janeiro',
            state: 'RJ',
            rating: 5.0,
            completed_shifts: 0,
            bio: 'Produtor executivo de festivais e eventos artísticos.'
          });
        }
        return res.json({ success: true, role: 'employer', user: employer });
      }

      // Check if it matches an active opportunity access code
      const opportunities = await getOpportunities();
      const opp = opportunities.find(o => o.access_code === upperCode);
      if (opp) {
        // Log in as temporary guest freelancer
        return res.json({
          success: true,
          role: 'guest',
          user: {
            id: 'guest',
            name: 'Acesso Convidado',
            email: 'convidado@gigbr.com.br',
            role: 'guest',
            isGuest: true,
            accessCode: upperCode,
            targetOpportunityId: opp.id
          }
        });
      }

      return res.status(401).json({ success: false, error: 'Código de acesso inválido.' });
    }

    // C. User Login (If email/password or email/CPF provided)
    if (email && (password || cpfOrCnpj)) {
      let user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Usuário não cadastrado no diretório GIG BR. Cadastre-se antes de fazer o login!' });
      }
      
      if (password) {
        if (user.password) {
          if (user.password !== password) {
            return res.status(401).json({ success: false, error: 'Senha incorreta!' });
          }
        } else {
          // Auto-save password on first login if not set yet
          await updateUser(user.id, { password });
          user.password = password;
        }
      } else {
        const existingCpf = user.cpf || user.cnpj;
        if (existingCpf && existingCpf !== cpfOrCnpj) {
          return res.status(401).json({ success: false, error: 'Credenciais inválidas. O CPF/CNPJ informado não confere!' });
        }
      }

      return res.json({ success: true, role: user.role, user: user });
    }

    return res.status(400).json({ success: false, error: 'Dados insuficientes para login.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Users REST API
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, cpf, cnpj } = req.body;
    const document = cpf || cnpj;
    if (email || document) {
      const isDuplicate = await checkDuplicateUser(email, document);
      if (isDuplicate) {
        return res.status(400).json({ error: 'E-mail ou documento CPF/CNPJ já cadastrado no sistema!' });
      }
    }
    const user = await insertUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Groups REST API
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await getGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/groups', async (req, res) => {
  try {
    const group = await insertGroup(req.body);
    if (group.leader_id) {
      await addGroupMember(group.id, group.leader_id);
    }
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/groups/:id', async (req, res) => {
  try {
    const updated = await updateGroup(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    await deleteGroup(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/groups/:id/members', async (req, res) => {
  try {
    const members = await getGroupMembers(req.params.id);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/groups/:id/members', async (req, res) => {
  try {
    await addGroupMember(req.params.id, req.body.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Opportunities API
app.get('/api/opportunities', async (req, res) => {
  try {
    await cleanupOpportunities();
    const opportunities = await getOpportunities();
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/opportunities', async (req, res) => {
  try {
    const opp = await insertOpportunity(req.body);
    res.status(201).json(opp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/opportunities/:id', async (req, res) => {
  try {
    const updated = await updateOpportunity(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/opportunities/:id', async (req, res) => {
  try {
    await deleteOpportunity(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email dispatch simulator endpoint (writes to emails_sent.log)
app.post('/api/emails/send', async (req, res) => {
  try {
    const { sender, recipient, subject, body } = req.body;
    
    // Output check to server console
    console.log(`[EMAIL DISPATCH] sending email to: ${recipient} | subject: ${subject}`);
    
    const logPath = path.join(process.cwd(), 'server', 'emails_sent.log');
    const logEntry = `
==================================================
DATA/HORA: ${new Date().toLocaleString('pt-BR')}
REMETENTE: ${sender || 'sistema@gigbr.com.br'}
DESTINATÁRIO: ${recipient || 'desconhecido@gigbr.com.br'}
ASSUNTO: ${subject || 'Sem Assunto'}
MENSAGEM:
${body || '(Sem Conteúdo)'}
==================================================
`;
    fs.appendFileSync(logPath, logEntry, 'utf8');

    // Real SMTP dispatch using the configured Transporter
    if (smtpTransporter) {
      const mailOptions = {
        from: `"GIG BR" <${process.env.SMTP_USER || 'studiodwdigital@gmail.com'}>`,
        to: recipient,
        replyTo: sender,
        subject: subject,
        text: body
      };
      smtpTransporter.sendMail(mailOptions).then(info => {
        console.log('[SMTP SUCCESS] Real email sent:', info.messageId);
      }).catch(mailErr => {
        console.error('[SMTP ERROR] Failed to dispatch real email:', mailErr.message);
      });
    }
    
    res.json({ success: true, message: 'Email logged and dispatched successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Shifts API
app.get('/api/shifts', async (req, res) => {
  try {
    const shifts = await getShifts();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/shifts', async (req, res) => {
  try {
    const shift = await insertShift(req.body);
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/shifts/:id', async (req, res) => {
  try {
    const shift = await updateShift(req.params.id, req.body);
    res.json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Events API
app.get('/api/events', async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = await insertEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id/spend', async (req, res) => {
  try {
    const event = await updateEventSpend(req.params.id, req.body.currentSpend);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await updateEvent(req.params.id, req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize server database pool and start listening
const dbPromise = initializeDatabase().then(() => seedDefaultAdmin());

app.use(async (req, res, next) => {
  try {
    await dbPromise;
  } catch (err) {
    console.error("Database initialization error during request:", err);
  }
  next();
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server successfully listening on port ${PORT}`);
  });
}

export default app;
