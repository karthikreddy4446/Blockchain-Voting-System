// Import required modules
const express = require('express');
const path = require('path');
const blockchain = require('./backend/server');

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API Routes
app.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await blockchain.getCandidateList();
        res.json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/votes', async (req, res) => {
    try {
        const candidate = req.query.candidate;
        if (!candidate) {
            return res.status(400).json({ success: false, error: 'Candidate name is required' });
        }
        const votes = await blockchain.getTotalVotesFor(candidate);
        res.json({ success: true, votes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/vote', async (req, res) => {
    try {
        const { candidate, from } = req.body;
        if (!candidate) {
            return res.status(400).json({ success: false, error: 'Candidate name is required' });
        }
        
        await blockchain.voteForCandidate(candidate);
        res.json({ success: true, message: `Successfully voted for ${candidate}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve the frontend for any other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize the blockchain connection and start the server
blockchain.testConnection()
    .then(() => {
        console.log('Connected to blockchain network');
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to connect to blockchain:', error);
        process.exit(1);
    });