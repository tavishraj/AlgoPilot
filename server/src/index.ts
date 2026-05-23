import app from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

// ─── Future: WebSocket Setup ─────────────────────────────
// import { createServer } from 'http';
// import { setupWebSocket } from './websocket/index.js';
// const server = createServer(app);
// setupWebSocket(server);

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 AlgoPilot API running on port ${env.PORT}`);
  logger.info(`📦 Environment: ${env.NODE_ENV}`);
  logger.info(`🔗 Health: http://localhost:${env.PORT}/api/health`);
});

// ─── Graceful Shutdown ───────────────────────────────────
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
