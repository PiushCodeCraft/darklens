import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import submitRouter from './routes/submit.js';
import feedRouter from './routes/feed.js';     // <-- Make sure this is imported
import voteRouter from './routes/vote.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', submitRouter);
app.use('/api', feedRouter);                     // <-- Make sure this line exists
app.use('/api', voteRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});