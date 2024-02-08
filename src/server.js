import http from 'http';

import config from './config/config.js';

import app from './app.js';
import { init } from './socket.js';
import { initDB } from './db/mongodb.js';
import { logger } from "./config/logger.js";

await initDB();

const server = http.createServer(app);
const PORT = config.port;

init(server);

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT} 🚀`);
});