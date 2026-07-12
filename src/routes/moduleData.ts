import { FastifyInstance } from 'fastify';
import { pool } from '../db';

export default async function moduleDataRoutes(app: FastifyInstance) {
  app.get('/os/module-data', async () => {
    const [contacts, deals, projects, tasks, invoices] = await Promise.all([
      pool.query('SELECT id, name, company, role, email, tags, updated_at as "updatedAt" FROM contacts'),
      pool.query('SELECT id, title, company, value, stage, owner, updated_at as "updatedAt" FROM deals'),
      pool.query('SELECT id, name, client, status, progress, due_date as "dueDate", lead FROM projects'),
      pool.query('SELECT id, title, status, assignee, project, priority, updated_at as "updatedAt" FROM tasks'),
      pool.query('SELECT id, number, client, amount, status, issued, due FROM invoices'),
    ]);

    return {
      contacts: contacts.rows,
      deals: deals.rows,
      projects: projects.rows,
      tasks: tasks.rows,
      invoices: invoices.rows,
    };
  });
}
