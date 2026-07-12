import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pool } from './db';
import { seed } from './seed';
import snapshotRoutes from './routes/snapshot';
import moduleDataRoutes from './routes/moduleData';
import tasksRoutes from './routes/tasks';
import invoicesRoutes from './routes/invoices';
import contactsRoutes from './routes/contacts';

const app = Fastify({ logger: true });

const API_TOKEN = process.env.API_TOKEN || '';

const allowedOrigins = [
  'http://localhost:8080',
  ...(process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : []),
];

app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /\.lovable\.app$/.test(origin) ||
      /\.lovableproject\.com$/.test(origin)
    ) {
      return cb(null, true);
    }
    cb(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
});

app.addHook('onRequest', async (request, reply) => {
  if (request.url === '/health') return;
  const auth = request.headers.authorization;
  if (!auth || auth !== `Bearer ${API_TOKEN}`) {
    return reply.code(401).send({ error: 'unauthorized' });
  }
});

app.get('/health', async () => ({ ok: true }));

app.register(snapshotRoutes);
app.register(moduleDataRoutes);
app.register(tasksRoutes);
app.register(invoicesRoutes);
app.register(contactsRoutes);

const start = async () => {
  try {
    await seed();
    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
