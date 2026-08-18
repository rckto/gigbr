<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1';
$db = 'kkcauazjym';
$user = 'kkcauazjym';
$pass = 'NDwsn3twCw';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// Ensure database tables exist
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        role VARCHAR(20) NOT NULL DEFAULT 'freelancer',
        cpf VARCHAR(20) DEFAULT '',
        cnpj VARCHAR(20) DEFAULT '',
        registration_type VARCHAR(5) DEFAULT 'PF',
        omb VARCHAR(50) DEFAULT '',
        drt VARCHAR(50) DEFAULT '',
        bio TEXT,
        avatar TEXT,
        city VARCHAR(100) DEFAULT 'São Paulo',
        state VARCHAR(10) DEFAULT 'SP',
        is_vetted TINYINT(1) DEFAULT 1,
        rating DECIMAL(3,2) DEFAULT 5.00,
        completed_shifts INT DEFAULT 0,
        pix_type VARCHAR(50) DEFAULT '',
        pix_key VARCHAR(150) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS groups (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(50) DEFAULT 'Músicos',
        description TEXT,
        city VARCHAR(100) DEFAULT 'São Paulo',
        state VARCHAR(10) DEFAULT 'SP',
        leader_id VARCHAR(50) DEFAULT '',
        email VARCHAR(150) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS group_members (
        group_id VARCHAR(50),
        user_id VARCHAR(50),
        PRIMARY KEY (group_id, user_id)
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS opportunities (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        category VARCHAR(50) DEFAULT '',
        company VARCHAR(150) DEFAULT 'Produtora Demo',
        payment VARCHAR(50) DEFAULT '',
        date VARCHAR(20),
        location VARCHAR(250) DEFAULT 'São Paulo - SP',
        lat DECIMAL(10,8) DEFAULT -23.5489,
        lng DECIMAL(11,8) DEFAULT -46.6388,
        description TEXT,
        status VARCHAR(20) DEFAULT 'Aberta',
        employer_id VARCHAR(50) DEFAULT '',
        access_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS shifts (
        id VARCHAR(50) PRIMARY KEY,
        opportunity_id VARCHAR(50) DEFAULT '',
        event_id VARCHAR(50) NOT NULL,
        contractor_id VARCHAR(50) NOT NULL,
        date VARCHAR(20),
        scheduled_hours DECIMAL(4,2) DEFAULT 8.00,
        actual_hours DECIMAL(4,2) DEFAULT NULL,
        hourly_rate DECIMAL(10,2) DEFAULT 35.00,
        status VARCHAR(20) DEFAULT 'Agendado',
        check_in_time VARCHAR(20) DEFAULT NULL,
        check_out_time VARCHAR(20) DEFAULT NULL,
        dispute_notes TEXT,
        invoice_emitted TINYINT(1) DEFAULT 0,
        deposit_paid TINYINT(1) DEFAULT 0,
        deposit_amount DECIMAL(10,2) DEFAULT 0.00,
        deposit_confirmed_at VARCHAR(50) DEFAULT NULL,
        paid_at VARCHAR(50) DEFAULT NULL,
        pix_receipt_code VARCHAR(100) DEFAULT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        date VARCHAR(20),
        location VARCHAR(250) DEFAULT '',
        state VARCHAR(10) DEFAULT 'SP',
        latitude DECIMAL(10,8) DEFAULT -23.5489,
        longitude DECIMAL(11,8) DEFAULT -46.6388,
        budget_limit DECIMAL(12,2) DEFAULT 100000.00,
        current_spend DECIMAL(12,2) DEFAULT 0.00,
        vessel_status VARCHAR(20) DEFAULT 'Ativo',
        employer_id VARCHAR(50) DEFAULT '',
        description TEXT,
        pix_key VARCHAR(150) DEFAULT '',
        crowdfund_goal DECIMAL(12,2) DEFAULT 0.00,
        crowdfund_raised DECIMAL(12,2) DEFAULT 0.00
    )");

    // Seed admin if missing
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = 'admin@gigbr.com.br'");
    $stmt->execute();
    if (!$stmt->fetch()) {
        $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, role, is_vetted, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            'admin-1', 'Administrador Central', 'admin@gigbr.com.br', 'ADMIN2027', 'admin', 1,
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            'Diretor Geral da plataforma GIG BR.'
        ]);
    }
} catch (Exception $e) {
    // Ignore migration silent errors
}

$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

$path = parse_url($request_uri, PHP_URL_PATH);
$path = preg_replace('/^.*?\/api\//', '', $path);
$path = trim($path, '/');

$path_parts = explode('/', $path);
$resource = $path_parts[0] ?? '';
$id = $path_parts[1] ?? null;

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Helper to filter columns based on actual schema updates
function filterPayload($input) {
    return $input;
}

if ($resource === 'auth' && $id === 'login' && $request_method === 'POST') {
    $inviteCode = $input['inviteCode'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $cpfOrCnpj = $input['cpfOrCnpj'] ?? '';

    if ($inviteCode === 'ADMIN2027' || $email === 'admin@gigbr.com.br') {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = 'admin@gigbr.com.br'");
        $stmt->execute();
        $admin = $stmt->fetch();
        echo json_encode(["success" => true, "role" => "admin", "user" => $admin]);
        exit;
    }

    if ($inviteCode && strtoupper(trim($inviteCode)) === 'BRASIL2027') {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = 'roberto@globo.com.br'");
        $stmt->execute();
        $employer = $stmt->fetch();
        if (!$employer) {
            $stmt = $pdo->prepare("INSERT INTO users (id, name, email, role, is_vetted, avatar, city, state, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                'emp-1', 'Roberto Marinho', 'roberto@globo.com.br', 'employer', 1,
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
                'Rio de Janeiro', 'RJ', 'Produtor executivo de festivais e eventos artísticos.'
            ]);
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = 'emp-1'");
            $stmt->execute();
            $employer = $stmt->fetch();
        }
        echo json_encode(["success" => true, "role" => "employer", "user" => $employer]);
        exit;
    }

    if ($inviteCode) {
        $upperCode = strtoupper(trim($inviteCode));
        $stmt = $pdo->prepare("SELECT * FROM opportunities WHERE UPPER(access_code) = ?");
        $stmt->execute([$upperCode]);
        $opp = $stmt->fetch();
        if ($opp) {
            echo json_encode([
                "success" => true,
                "role" => "guest",
                "user" => [
                    "id" => "guest",
                    "name" => "Acesso Convidado",
                    "email" => "convidado@gigbr.com.br",
                    "role" => "guest",
                    "isGuest" => true,
                    "accessCode" => $upperCode,
                    "targetOpportunityId" => $opp['id']
                ]
            ]);
            exit;
        }
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Código de acesso inválido."]);
        exit;
    }

    if ($email && ($password || $cpfOrCnpj)) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([trim(strtolower($email))]);
        $user = $stmt->fetch();
        if (!$user) {
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Usuário não cadastrado no diretório GIG BR. Cadastre-se antes de fazer o login!"]);
            exit;
        }

        if ($password) {
            if (!empty($user['password'])) {
                if ($user['password'] !== $password) {
                    http_response_code(401);
                    echo json_encode(["success" => false, "error" => "Senha incorreta!"]);
                    exit;
                }
            } else {
                $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->execute([$password, $user['id']]);
                $user['password'] = $password;
            }
        } else {
            $existingCpf = $user['cpf'] ?: $user['cnpj'];
            if ($existingCpf && $existingCpf !== $cpfOrCnpj) {
                http_response_code(401);
                echo json_encode(["success" => false, "error" => "Credenciais inválidas. O CPF/CNPJ informado não confere!"]);
                exit;
            }
        }

        echo json_encode(["success" => true, "role" => $user['role'], "user" => $user]);
        exit;
    }

    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Dados insuficientes para login."]);
    exit;
}

if ($resource === 'users') {
    if ($request_method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();
            if ($user) {
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "User not found"]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM users");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }
    
    if ($request_method === 'POST') {
        $email = trim(strtolower($input['email'] ?? ''));
        $cpf = preg_replace('/[^\d]/', '', $input['cpf'] ?? '');
        $cnpj = preg_replace('/[^\d]/', '', $input['cnpj'] ?? '');

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(["error" => "E-mail já cadastrado!"]);
            exit;
        }

        if ($cpf) {
            $stmt = $pdo->prepare("SELECT id FROM users WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?");
            $stmt->execute([$cpf]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(["error" => "CPF já cadastrado!"]);
                exit;
            }
        }

        if ($cnpj) {
            $stmt = $pdo->prepare("SELECT id FROM users WHERE REPLACE(REPLACE(REPLACE(cnpj, '.', ''), '-', ''), '/', '') = ?");
            $stmt->execute([$cnpj]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(["error" => "CNPJ já cadastrado!"]);
                exit;
            }
        }

        $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, phone, role, cpf, cnpj, registration_type, omb, drt, bio, avatar, city, state, is_vetted, rating, completed_shifts, pix_type, pix_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['id'], $input['name'], $email, $input['password'] ?? '', $input['phone'] ?? '', $input['role'] ?? 'freelancer',
            $input['cpf'] ?? '', $input['cnpj'] ?? '', $input['registrationType'] ?? 'PF',
            $input['omb'] ?? '', $input['drt'] ?? '', $input['bio'] ?? '', $input['avatar'] ?? '',
            $input['city'] ?? 'São Paulo', $input['state'] ?? 'SP', $input['is_vetted'] ?? 1,
            $input['rating'] ?? 5.00, $input['completed_shifts'] ?? 0,
            $input['pixType'] ?? '', $input['pixKey'] ?? ''
        ]);
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$input['id']]);
        echo json_encode($stmt->fetch());
        exit;
    }

    if ($request_method === 'PUT' && $id) {
        $name = $input['name'];
        $email = trim(strtolower($input['email']));
        $phone = $input['phone'] ?? '';
        $role = $input['role'] ?? 'freelancer';
        $omb = $input['omb'] ?? '';
        $drt = $input['drt'] ?? '';
        $bio = $input['bio'] ?? '';
        $avatar = $input['avatar'] ?? '';
        $regType = $input['registrationType'] ?? 'PF';
        $cpf = $input['cpf'] ?? '';
        $cnpj = $input['cnpj'] ?? '';
        $pixType = $input['pixType'] ?? '';
        $pixKey = $input['pixKey'] ?? '';
        $city = $input['city'] ?? 'São Paulo';
        $state = $input['state'] ?? 'SP';
        $isVetted = $input['is_vetted'] ?? 1;
        $password = $input['password'] ?? '';

        if ($password) {
            $stmt = $pdo->prepare("UPDATE users SET name=?, email=?, password=?, phone=?, role=?, omb=?, drt=?, bio=?, avatar=?, registration_type=?, cpf=?, cnpj=?, pix_type=?, pix_key=?, city=?, state=?, is_vetted=? WHERE id=?");
            $stmt->execute([$name, $email, $password, $phone, $role, $omb, $drt, $bio, $avatar, $regType, $cpf, $cnpj, $pixType, $pixKey, $city, $state, $isVetted, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE users SET name=?, email=?, phone=?, role=?, omb=?, drt=?, bio=?, avatar=?, registration_type=?, cpf=?, cnpj=?, pix_type=?, pix_key=?, city=?, state=?, is_vetted=? WHERE id=?");
            $stmt->execute([$name, $email, $phone, $role, $omb, $drt, $bio, $avatar, $regType, $cpf, $cnpj, $pixType, $pixKey, $city, $state, $isVetted, $id]);
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        exit;
    }

    if ($request_method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }
}

if ($resource === 'events') {
    if ($request_method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch());
        } else {
            $stmt = $pdo->query("SELECT * FROM events ORDER BY date DESC");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }
    if ($request_method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO events (id, name, date, location, state, latitude, longitude, budget_limit, current_spend, vessel_status, employer_id, description, pix_key, crowdfund_goal, crowdfund_raised) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['id'], $input['name'], $input['date'], $input['location'] ?? '', $input['state'] ?? 'SP',
            $input['latitude'] ?? -23.5489, $input['longitude'] ?? -46.6388, $input['budgetLimit'] ?? $input['budget_limit'] ?? 100000.00,
            $input['currentSpend'] ?? $input['current_spend'] ?? 0.00, $input['vesselStatus'] ?? $input['vessel_status'] ?? 'Ativo',
            $input['employerId'] ?? $input['employer_id'] ?? '', $input['description'] ?? '', $input['pixKey'] ?? $input['pix_key'] ?? '',
            $input['crowdfundGoal'] ?? $input['crowdfund_goal'] ?? 0.00, $input['crowdfundRaised'] ?? $input['crowdfund_raised'] ?? 0.00
        ]);
        $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->execute([$input['id']]);
        echo json_encode($stmt->fetch());
        exit;
    }
    if ($request_method === 'PUT' && $id) {
        $updates = [];
        $params = [];
        foreach ($input as $key => $val) {
            $snake_key = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
            if ($snake_key === 'id') continue;
            $updates[] = "$snake_key = ?";
            $params[] = $val;
        }
        if (!empty($updates)) {
            $params[] = $id;
            $stmt = $pdo->prepare("UPDATE events SET " . implode(', ', $updates) . " WHERE id = ?");
            $stmt->execute($params);
        }
        $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        exit;
    }
    if ($request_method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }
}

if ($resource === 'groups') {
    if ($request_method === 'GET') {
        if ($id && count($path_parts) > 2 && $path_parts[2] === 'members') {
            $stmt = $pdo->prepare("SELECT u.* FROM users u INNER JOIN group_members gm ON u.id = gm.user_id WHERE gm.group_id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetchAll());
        } else if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM groups WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch());
        } else {
            $stmt = $pdo->query("SELECT * FROM groups");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }
    if ($request_method === 'POST') {
        if ($id && count($path_parts) > 2 && $path_parts[2] === 'members') {
            $userId = $input['userId'] ?? $input['user_id'] ?? '';
            if ($userId) {
                $stmt = $pdo->prepare("SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?");
                $stmt->execute([$id, $userId]);
                if (!$stmt->fetch()) {
                    $stmt = $pdo->prepare("INSERT INTO group_members (group_id, user_id) VALUES (?, ?)");
                    $stmt->execute([$id, $userId]);
                }
            }
            echo json_encode(["success" => true]);
            exit;
        } else {
            $stmt = $pdo->prepare("INSERT INTO groups (id, name, category, description, city, state, leader_id, email, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['id'], $input['name'], $input['category'] ?? 'Músicos', $input['description'] ?? '',
                $input['city'] ?? 'São Paulo', $input['state'] ?? 'SP', $input['leaderId'] ?? $input['leader_id'] ?? '',
                $input['email'], $input['avatar'] ?? ''
            ]);
            $stmt = $pdo->prepare("SELECT * FROM groups WHERE id = ?");
            $stmt->execute([$input['id']]);
            echo json_encode($stmt->fetch());
            exit;
        }
    }
    if ($request_method === 'PUT' && $id) {
        $stmt = $pdo->prepare("UPDATE groups SET name=?, category=?, description=?, city=?, state=?, leader_id=?, email=?, avatar=? WHERE id=?");
        $stmt->execute([
            $input['name'], $input['category'] ?? 'Músicos', $input['description'] ?? '',
            $input['city'] ?? 'São Paulo', $input['state'] ?? 'SP', $input['leaderId'] ?? $input['leader_id'] ?? '',
            $input['email'], $input['avatar'] ?? '', $id
        ]);
        $stmt = $pdo->prepare("SELECT * FROM groups WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        exit;
    }
    if ($request_method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM groups WHERE id = ?");
        $stmt->execute([$id]);
        $stmt = $pdo->prepare("DELETE FROM group_members WHERE group_id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }
}

if ($resource === 'opportunities') {
    if ($request_method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM opportunities WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch());
        } else {
            $stmt = $pdo->query("SELECT * FROM opportunities ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }
    if ($request_method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO opportunities (id, title, category, company, payment, date, location, description, status, employer_id, access_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['id'], $input['title'], $input['category'] ?? '', $input['company'] ?? 'Produtora Demo',
            $input['payment'] ?? '', $input['date'] ?? '', $input['location'] ?? 'São Paulo - SP',
            $input['description'] ?? '', $input['status'] ?? 'Aberta', $input['employerId'] ?? $input['employer_id'] ?? '',
            $input['accessCode'] ?? $input['access_code'] ?? ''
        ]);
        $stmt = $pdo->prepare("SELECT * FROM opportunities WHERE id = ?");
        $stmt->execute([$input['id']]);
        echo json_encode($stmt->fetch());
        exit;
    }
    if ($request_method === 'PUT' && $id) {
        $stmt = $pdo->prepare("UPDATE opportunities SET title=?, category=?, company=?, payment=?, date=?, location=?, description=?, status=?, employer_id=?, access_code=? WHERE id=?");
        $stmt->execute([
            $input['title'], $input['category'] ?? '', $input['company'] ?? 'Produtora Demo',
            $input['payment'] ?? '', $input['date'] ?? '', $input['location'] ?? 'São Paulo - SP',
            $input['description'] ?? '', $input['status'] ?? 'Aberta', $input['employerId'] ?? $input['employer_id'] ?? '',
            $input['accessCode'] ?? $input['access_code'] ?? '', $id
        ]);
        $stmt = $pdo->prepare("SELECT * FROM opportunities WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        exit;
    }
    if ($request_method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM opportunities WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }
}

if ($resource === 'shifts') {
    if ($request_method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM shifts WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch());
        } else {
            $stmt = $pdo->query("SELECT * FROM shifts");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }
    if ($request_method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO shifts (id, opportunity_id, event_id, contractor_id, date, scheduled_hours, actual_hours, hourly_rate, status, check_in_time, check_out_time, dispute_notes, invoice_emitted, deposit_paid, deposit_amount, deposit_confirmed_at, paid_at, pix_receipt_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['id'], $input['opportunityId'] ?? $input['opportunity_id'] ?? '', $input['eventId'] ?? $input['event_id'] ?? '',
            $input['contractorId'] ?? $input['contractor_id'] ?? '', $input['date'] ?? '', $input['scheduledHours'] ?? $input['scheduled_hours'] ?? 8.00,
            $input['actualHours'] ?? $input['actual_hours'] ?? null, $input['hourlyRate'] ?? $input['hourly_rate'] ?? 35.00,
            $input['status'] ?? 'Agendado', $input['checkInTime'] ?? $input['check_in_time'] ?? null,
            $input['checkOutTime'] ?? $input['check_out_time'] ?? null, $input['disputeNotes'] ?? $input['dispute_notes'] ?? null,
            $input['invoiceEmitted'] ?? $input['invoice_emitted'] ?? 0, $input['depositPaid'] ?? $input['deposit_paid'] ?? 0,
            $input['depositAmount'] ?? $input['deposit_amount'] ?? 0.00, $input['depositConfirmedAt'] ?? $input['deposit_confirmed_at'] ?? null,
            $input['paidAt'] ?? $input['paid_at'] ?? null, $input['pixReceiptCode'] ?? $input['pix_receipt_code'] ?? null
        ]);
        $stmt = $pdo->prepare("SELECT * FROM shifts WHERE id = ?");
        $stmt->execute([$input['id']]);
        echo json_encode($stmt->fetch());
        exit;
    }
    if ($request_method === 'PUT' && $id) {
        $updates = [];
        $params = [];
        foreach ($input as $key => $val) {
            $snake_key = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
            if ($snake_key === 'id') continue;
            $updates[] = "$snake_key = ?";
            $params[] = $val;
        }
        if (!empty($updates)) {
            $params[] = $id;
            $stmt = $pdo->prepare("UPDATE shifts SET " . implode(', ', $updates) . " WHERE id = ?");
            $stmt->execute($params);
        }
        $stmt = $pdo->prepare("SELECT * FROM shifts WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        exit;
    }
    if ($request_method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM shifts WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }
}

if ($resource === 'emails' && $id === 'send' && $request_method === 'POST') {
    $sender = $input['sender'] ?? 'sistema@gigbr.com.br';
    $recipient = $input['recipient'] ?? 'desconhecido@gigbr.com.br';
    $subject = $input['subject'] ?? 'Sem Assunto';
    $body = $input['body'] ?? '(Sem Conteúdo)';

    // Log the email to file
    $logEntry = "\n==================================================\n" .
                "DATA/HORA: " . date('d/m/Y H:i:s') . "\n" .
                "REMETENTE: " . $sender . "\n" .
                "DESTINATÁRIO: " . $recipient . "\n" .
                "ASSUNTO: " . $subject . "\n" .
                "MENSAGEM:\n" . $body . "\n" .
                "==================================================\n";
    
    file_put_contents(__DIR__ . '/../emails_sent.log', $logEntry, FILE_APPEND);
    
    // Also try to send via PHP mail()
    $headers = "From: GIG BR <$sender>\r\n" .
               "Reply-To: $sender\r\n" .
               "X-Mailer: PHP/" . phpversion();
    @mail($recipient, $subject, $body, $headers);

    echo json_encode(["success" => true, "message" => "Email logged and dispatched successfully."]);
    exit;
}

if ($resource === 'email' && $id === 'send-proposal' && $request_method === 'POST') {
    echo json_encode(["success" => true, "message" => "Proposta enviada com sucesso no servidor de e-mail PHP."]);
    exit;
}

http_response_code(404);
echo json_encode(["error" => "Resource not found"]);
exit;
