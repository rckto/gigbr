-- GIG BR MySQL Database Schema

CREATE DATABASE IF NOT EXISTS gigbr;
USE gigbr;

-- Table for users (Freelancers, Employers, Administrators)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'freelancer', -- 'admin', 'employer', 'freelancer'
    cpf VARCHAR(20),
    cnpj VARCHAR(20),
    registration_type VARCHAR(5) DEFAULT 'PF', -- 'PF' or 'PJ'
    omb VARCHAR(50),
    drt VARCHAR(50),
    bio TEXT,
    avatar TEXT,
    city VARCHAR(100) DEFAULT 'São Paulo',
    state VARCHAR(10) DEFAULT 'SP',
    is_vetted TINYINT(1) DEFAULT 1,
    rating DECIMAL(3,2) DEFAULT 5.00,
    completed_shifts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for bands and teams
CREATE TABLE IF NOT EXISTS groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Músicos',
    description TEXT,
    city VARCHAR(100) DEFAULT 'São Paulo',
    state VARCHAR(10) DEFAULT 'SP',
    leader_id VARCHAR(50),
    email VARCHAR(150) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table mapping members to bands/groups
CREATE TABLE IF NOT EXISTS group_members (
    group_id VARCHAR(50),
    user_id VARCHAR(50),
    PRIMARY KEY (group_id, user_id)
);

-- Table for posted job opportunities
CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    company VARCHAR(150) DEFAULT 'Produtora Demo',
    payment VARCHAR(50) NOT NULL,
    date VARCHAR(20),
    location VARCHAR(250) DEFAULT 'São Paulo - SP',
    lat DECIMAL(10,8) DEFAULT -23.5489,
    lng DECIMAL(11,8) DEFAULT -46.6388,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Aberta',
    employer_id VARCHAR(50),
    access_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for shifts and check-ins
CREATE TABLE IF NOT EXISTS shifts (
    id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL,
    contractor_id VARCHAR(50) NOT NULL,
    date VARCHAR(20),
    scheduled_hours DECIMAL(4,2) DEFAULT 8.00,
    actual_hours DECIMAL(4,2) DEFAULT NULL,
    hourly_rate DECIMAL(10,2) DEFAULT 35.00,
    status VARCHAR(20) DEFAULT 'Agendado', -- 'Agendado', 'Em Andamento', 'Finalizado', 'Pago', 'Disputado'
    check_in_time VARCHAR(20) DEFAULT NULL,
    check_out_time VARCHAR(20) DEFAULT NULL,
    dispute_notes TEXT,
    invoice_emitted TINYINT(1) DEFAULT 0,
    deposit_paid TINYINT(1) DEFAULT 0,
    deposit_amount DECIMAL(10,2) DEFAULT 0.00,
    deposit_confirmed_at VARCHAR(50) DEFAULT NULL,
    paid_at VARCHAR(50) DEFAULT NULL,
    pix_receipt_code VARCHAR(100) DEFAULT NULL
);

-- Table for major events
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    date VARCHAR(20),
    location VARCHAR(250),
    state VARCHAR(10) DEFAULT 'SP',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    budget_limit DECIMAL(12,2) DEFAULT 100000.00,
    current_spend DECIMAL(12,2) DEFAULT 0.00,
    vessel_status VARCHAR(20) DEFAULT 'Ativo'
);
