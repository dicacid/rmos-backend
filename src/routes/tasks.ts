import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../db';

const createTaskSchema = z.object({
  title: z.string(),
  assignee: z.string().optional(),
  project: z.string().optional(),
  priority: z.enum(['low', 'med', 'high']).optional().default('med'),
});

const updateTaskSchema = z.object({
  status: z.enum(['backlog', 'doing', 'review', 'done']),
});

export default async function tasksRoutes(app: FastifyInstance) {
  app.post('/tasks', async (request, reply) => {
    const body = createTaskSchema.parse(request.body);
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, assignee, project, priority, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, title, status, assignee, project, priority, updated_at as "updatedAt"`,
      [body.title, body.assignee ?? null, body.project ?? null, body.priority]
    );
    return reply.code(201).send(rows[0]);
  });

  app.patch('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateTaskSchema.parse(request.body);
    const { rows } = await pool.query(
      `UPDATE tasks SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, title, status, assignee, project, priority, updated_at as "updatedAt"`,
      [body.status, id]
    );
    if (rows.length === 0) return reply.code(404).send({ error: 'not found' });
    return rows[0];
  });
}
