import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../db';

const createInvoiceSchema = z.object({
  client: z.string(),
  amount: z.number(),
});

export default async function invoicesRoutes(app: FastifyInstance) {
  app.post('/invoices', async (request, reply) => {
    const body = createInvoiceSchema.parse(request.body);
    const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM invoices');
    const nextNum = parseInt(countRows[0].count) + 1;
    const number = `INV-${String(nextNum).padStart(4, '0')}`;
    const { rows } = await pool.query(
      `INSERT INTO invoices (number, client, amount, issued, due)
       VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '14 days')
       RETURNING id, number, client, amount, status, issued, due`,
      [number, body.client, body.amount]
    );
    return reply.code(201).send(rows[0]);
  });
}
