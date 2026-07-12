import { FastifyInstance } from 'fastify';
import { pool } from '../db';

const WORKSPACES = [
  { id: 'home', label: 'Home', hint: 'OS overview', path: '/', pinned: true },
  { id: 'agents', label: 'Agents', hint: 'AI agent control', path: '/agents', pinned: true },
  { id: 'crm', label: 'CRM', hint: 'Contacts & deals', path: '/crm', pinned: true },
  { id: 'projects', label: 'Projects', hint: 'Project tracker', path: '/projects' },
  { id: 'finance', label: 'Finance', hint: 'Invoices & billing', path: '/finance' },
  { id: 'tasks', label: 'Tasks', hint: 'Task management', path: '/tasks' },
  { id: 'documents', label: 'Documents', hint: 'File storage', path: '/documents' },
  { id: 'knowledge', label: 'Knowledge', hint: 'Wiki & notes', path: '/knowledge' },
  { id: 'email', label: 'Email', hint: 'Inbox', path: '/email' },
  { id: 'calendar', label: 'Calendar', hint: 'Schedule', path: '/calendar' },
  { id: 'automation', label: 'Automation', hint: 'Workflows', path: '/automation' },
  { id: 'settings', label: 'Settings', hint: 'Configuration', path: '/settings' },
];

export default async function snapshotRoutes(app: FastifyInstance) {
  app.get('/os/snapshot', async () => {
    const [agents, insights, notifications, conversations, automations, memory] =
      await Promise.all([
        pool.query('SELECT id, name, role, status, last_action as "lastAction", updated_at as "updatedAt" FROM agents'),
        pool.query('SELECT id, title, detail, severity FROM insights'),
        pool.query('SELECT id, title, time FROM notifications'),
        pool.query('SELECT id, with_name as "with", snippet, updated_at as "updatedAt", unread FROM conversations'),
        pool.query('SELECT id, name, status, last_run as "lastRun" FROM automations'),
        pool.query('SELECT id, scope, label, detail, updated_at as "updatedAt" FROM memory_entries'),
      ]);

    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return {
      greeting: `${greeting}, welcome to Revealing Mind OS`,
      workspaces: WORKSPACES,
      agents: agents.rows,
      insights: insights.rows,
      notifications: notifications.rows,
      conversations: conversations.rows,
      automations: automations.rows,
      memory: memory.rows,
    };
  });
}
