// ─── WebSocket Module (Future) ────────────────────────────
// This module will handle real-time features:
// - Battle arena matchmaking
// - Live code collaboration
// - Real-time leaderboard updates
// - Submission status streaming

// import { Server as HttpServer } from 'http';
// import { Server as SocketServer } from 'socket.io';

// export function setupWebSocket(server: HttpServer) {
//   const io = new SocketServer(server, {
//     cors: {
//       origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
//       methods: ['GET', 'POST'],
//     },
//   });
//
//   io.on('connection', (socket) => {
//     console.log(`[WS] Client connected: ${socket.id}`);
//
//     // ─── Battle Events ──────────────
//     socket.on('battle:join', (data) => { /* ... */ });
//     socket.on('battle:submit', (data) => { /* ... */ });
//     socket.on('battle:leave', (data) => { /* ... */ });
//
//     // ─── Submission Events ─────────
//     socket.on('submission:status', (data) => { /* ... */ });
//
//     socket.on('disconnect', () => {
//       console.log(`[WS] Client disconnected: ${socket.id}`);
//     });
//   });
//
//   return io;
// }

export {};
