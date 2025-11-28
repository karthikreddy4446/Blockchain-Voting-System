const { Web3 } = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');  // Ganache RPC URL

const contractABI = [
    {
        "inputs": [{"internalType": "string[]","name": "candidateNames","type": "string[]"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "name": "candidateList",
        "outputs": [{"internalType": "string","name": "","type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "","type": "address"}],
        "name": "voters",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string","name": "","type": "string"}],
        "name": "votesReceived",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string","name": "candidate","type": "string"}],
        "name": "voteForCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string","name": "candidate","type": "string"}],
        "name": "totalVotesFor",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string","name": "candidate","type": "string"}],
        "name": "isValidCandidate",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
];
const contractAddress = '0xcA1ceC7441A61C0b5fB78424a12A118b5DFB91BA'; // Address from Ganache

const votingContract = new web3.eth.Contract(contractABI, contractAddress);

async function voteForCandidate(candidate) {
    try {
        // First check if the candidate is valid
        const isValid = await votingContract.methods.isValidCandidate(candidate).call();
        if (!isValid) {
            throw new Error(`Invalid candidate: ${candidate}`);
        }
        
        const accounts = await web3.eth.getAccounts();
        await votingContract.methods.voteForCandidate(candidate).send({ from: accounts[0] });
    } catch (error) {
        console.error(`Error voting for ${candidate}:`, error.message);
        throw error;
    }
}

async function getTotalVotesFor(candidate) {
    try {
        // First check if the candidate is valid
        const isValid = await votingContract.methods.isValidCandidate(candidate).call();
        if (!isValid) {
            throw new Error(`Invalid candidate: ${candidate}`);
        }
        
        const votes = await votingContract.methods.totalVotesFor(candidate).call();
        console.log(`Total votes for ${candidate}:`, votes);
        return votes;
    } catch (error) {
        console.error(`Error getting votes for ${candidate}:`, error.message);
        throw error;
    }
}

async function getCandidateList() {
    try {
        // Get the number of candidates
        let index = 0;
        const candidates = [];
        
        // Keep trying to get candidates until we get an error
        while (true) {
            try {
                const candidate = await votingContract.methods.candidateList(index).call();
                candidates.push(candidate);
                index++;
            } catch (error) {
                // We've reached the end of the list
                break;
            }
        }
        
        return candidates;
    } catch (error) {
        console.error('Error getting candidate list:', error.message);
        throw error;
    }
}

// Add a simple test function to verify the connection
async function testConnection() {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Connected to Ethereum network. Available accounts:', accounts);
        
        // Get the list of candidates
        const candidates = await getCandidateList();
        console.log('Available candidates:', candidates);
        
        return accounts;
    } catch (error) {
        console.error('Error connecting to Ethereum network:', error.message);
        throw error;
    }
}

// If this file is run directly, test the connection
if (require.main === module) {
    testConnection()
        .then(() => console.log('Connection test successful'))
        .catch(err => console.error('Connection test failed:', err));
}

module.exports = { voteForCandidate, getTotalVotesFor, getCandidateList, testConnection };
