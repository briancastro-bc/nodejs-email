import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express, { json } from 'express';

import router from './routes/router.js';

async function bootstrap() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors({
    origin: '*',
  }));
  app.use(json());

  app.use('/api', router);

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log('Server running on port: ', port);
  });
}

bootstrap()
  .catch(err => console.log(err));