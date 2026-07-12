CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT,
  value NUMERIC DEFAULT 0,
  stage TEXT DEFAULT 'lead',
  owner TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client TEXT,
  status TEXT DEFAULT 'planning',
  progress INTEGER DEFAULT 0,
  due_date TIMESTAMPTZ,
  lead TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'backlog',
  assignee TEXT,
  project TEXT,
  priority TEXT DEFAULT 'med',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  client TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'draft',
  issued TIMESTAMPTZ DEFAULT NOW(),
  due TIMESTAMPTZ DEFAULT NOW() + INTERVAL '14 days'
);

CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  status TEXT DEFAULT 'idle',
  last_action TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  detail TEXT,
  severity TEXT DEFAULT 'info'
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  with_name TEXT NOT NULL,
  snippet TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  unread INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'paused',
  last_run TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT DEFAULT 'personal',
  label TEXT NOT NULL,
  detail TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
