
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { findPartner, checkUserStatus, cancelUserWait } from './services/pairingService';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- API Endpoints ---

// Endpoint for a user to find a partner
app.post('/api/pair', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'A valid name is required.' });
  }

  try {
    const pairedResult = await findPartner(name);
    if (pairedResult) {
      // A partner was found immediately
      res.json({ status: 'PAIRED', pairedInfo: pairedResult });
    } else {
      // User has been added to the waiting queue
      res.json({ status: 'WAITING' });
    }
  } catch (error) {
    console.error('Error in /api/pair:', error);
    res.status(500).json({ error: 'An internal server error occurred while trying to pair.' });
  }
});

// Endpoint for a waiting user to poll for their status
app.get('/api/status/:name', (req, res) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is missing.' });
  }
  
  const statusResult = checkUserStatus(name);
  res.json(statusResult);
});

// Endpoint for a user to cancel their wait
app.post('/api/cancel', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'A valid name is required.' });
  }

  cancelUserWait(name);
  res.status(200).json({ message: 'Search cancelled successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Backend server is running at http://localhost:${port}`);
});
