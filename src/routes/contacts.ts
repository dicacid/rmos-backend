import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../db';

const createContactSchema = z.object({
  name: z.string(),
  company: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export default async function contactsRoutes(app: FastifyInstance) {
  app.post('/contacts', async (request, reply) => {
    const body = createContactSchema.parse(request.body);
    const { rows } = await pool.query(
      `INSERT INTO contacts (name, company, role, email, tags, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, name, company, role, email, tags, updated_at as "updatedAt"`,
      [body.name, body.company ?? null, body.role ?? null, body.email ?? null, body.tags]
    );
    return reply.code(201).send(rows[0]);
  });
}
