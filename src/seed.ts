import { pool } from './db';

export async function seed() {
  const client = await pool.connect();
  try {
    // Check if already seeded
    const { rows } = await client.query('SELECT COUNT(*) FROM agents');
    if (parseInt(rows[0].count) > 0) return;

    const now = new Date().toISOString();

    // Seed agents
    await client.query(`INSERT INTO agents (name, role, status, last_action, updated_at) VALUES
      ('Aria', 'Research Analyst', 'idle', 'Completed market analysis', $1),
      ('Bolt', 'Task Executor', 'thinking', 'Processing task queue', $1),
      ('Cleo', 'CRM Manager', 'acting', 'Updating contact records', $1)`, [now]);

    // Seed insights
    await client.query(`INSERT INTO insights (title, detail, severity) VALUES
      ('Revenue up 12% MoM', 'Driven by new enterprise deals', 'success'),
      ('3 tasks overdue', 'Action required in projects module', 'warn'),
      ('New lead from RevealingMind', 'High-value prospect in pipeline', 'info'),
      ('Server latency spike', 'P99 above threshold for 10 min', 'critical')`);

    // Seed notifications
    await client.query(`INSERT INTO notifications (title, time) VALUES
      ('Invoice INV-0001 overdue', $1),
      ('New message from Alex Chen', $1),
      ('Automation "Daily Report" completed', $1)`, [now]);

    // Seed conversations
    await client.query(`INSERT INTO conversations (with_name, snippet, updated_at, unread) VALUES
      ('Alex Chen', 'Can we schedule a demo this week?', $1, 2),
      ('Sarah Kim', 'Invoice received, processing now', $1, 0),
      ('Dev Team', 'PR merged to main', $1, 5)`, [now]);

    // Seed automations
    await client.query(`INSERT INTO automations (name, status, last_run) VALUES
      ('Daily Report', 'running', $1),
      ('Lead Scorer', 'paused', $1),
      ('Invoice Reminder', 'queued', $1)`, [now]);

    // Seed memory entries
    await client.query(`INSERT INTO memory_entries (scope, label, detail, updated_at) VALUES
      ('personal', 'User timezone', 'AEST (UTC+10)', $1),
      ('company', 'Company name', 'Revealing Mind', $1),
      ('project', 'Active sprint', 'Sprint 3 - Backend APIs', $1),
      ('conversation', 'Last discussed', 'Deployment strategy', $1)`, [now]);

    // Seed contacts
    await client.query(`INSERT INTO contacts (name, company, role, email, tags, updated_at) VALUES
      ('Alex Chen', 'TechCorp', 'CTO', 'alex@techcorp.com', ARRAY['vip','enterprise'], $1),
      ('Sarah Kim', 'Acme Inc', 'Finance Manager', 'sarah@acme.com', ARRAY['client'], $1),
      ('Jordan Lee', 'StartupXYZ', 'Founder', 'jordan@startupxyz.com', ARRAY['lead'], $1)`, [now]);

    // Seed deals
    await client.query(`INSERT INTO deals (title, company, value, stage, owner, updated_at) VALUES
      ('Enterprise Platform License', 'TechCorp', 45000, 'proposal', 'Alex', $1),
      ('Starter Package', 'StartupXYZ', 3500, 'qualified', 'Jordan', $1),
      ('Annual Renewal', 'Acme Inc', 12000, 'won', 'Sarah', $1)`, [now]);

    // Seed projects
    await client.query(`INSERT INTO projects (name, client, status, progress, due_date, lead, updated_at) VALUES
      ('RMOS Backend', 'Internal', 'active', 65, $1, 'Dev Team', $1),
      ('CRM Integration', 'TechCorp', 'planning', 10, $1, 'Alex', $1),
      ('Dashboard v2', 'Acme Inc', 'blocked', 40, $1, 'Sarah', $1)`, [now]);

    // Seed tasks
    await client.query(`INSERT INTO tasks (title, status, assignee, project, priority, updated_at) VALUES
      ('Set up Postgres schema', 'done', 'Dev Team', 'RMOS Backend', 'high', $1),
      ('Implement auth middleware', 'doing', 'Dev Team', 'RMOS Backend', 'high', $1),
      ('Write API docs', 'backlog', 'Dev Team', 'RMOS Backend', 'low', $1),
      ('Design CRM wireframes', 'review', 'Alex', 'CRM Integration', 'med', $1)`, [now]);

    // Seed invoices
    await client.query(`INSERT INTO invoices (number, client, amount, status, issued, due) VALUES
      ('INV-0001', 'TechCorp', 4500, 'overdue', $1, $1),
      ('INV-0002', 'Acme Inc', 1200, 'paid', $1, $1),
      ('INV-0003', 'StartupXYZ', 350, 'draft', $1, $1)`, [now]);

    console.log('Seed complete');
  } finally {
    client.release();
  }
}
