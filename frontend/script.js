// Initialize Web3
let web3;
let votingContract;
let currentAccount;
let hasVoted = false;
let candidates = [];

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
const contractAddress = '0xfB24037aacC33Ae5432FdA2F978F01582b8d0e5C'; // Address from Ganache

// DOM Elements
const connectionStatus = document.getElementById('connection-status');
const accountInfo = document.getElementById('account-info');
const candidatesList = document.getElementById('candidates-list');
const resultsContainer = document.getElementById('results');
const messageContainer = document.getElementById('message');

// Initialize the application
async function init() {
    try {
        // Check if MetaMask is installed
        if (window.ethereum) {
            // Use MetaMask provider
            web3 = new Web3(window.ethereum);
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                // Listen for account changes
                window.ethereum.on('accountsChanged', handleAccountsChanged);
                
                connectionStatus.textContent = 'Connected to Ethereum network';
                connectionStatus.classList.add('connected');
                
                // Initialize contract
                votingContract = new web3.eth.Contract(contractABI, contractAddress);
                
                // Get current account
                const accounts = await web3.eth.getAccounts();
                currentAccount = accounts[0];
                accountInfo.textContent = `Account: ${shortenAddress(currentAccount)}`;
                
                // Check if user has already voted
                await checkVotingStatus();
                
                // Load candidates and results
                await loadCandidates();
                await loadResults();
                
            } catch (error) {
                showMessage(`Error connecting to MetaMask: ${error.message}`, 'error');
            }
        } else {
            // Fallback to local provider (Ganache)
            web3 = new Web3('http://localhost:7545');
            connectionStatus.textContent = 'Connected to local Ethereum network (Ganache)';
            connectionStatus.classList.add('connected');
            
            // Initialize contract
            votingContract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Get current account
            const accounts = await web3.eth.getAccounts();
            currentAccount = accounts[0];
            accountInfo.textContent = `Account: ${shortenAddress(currentAccount)}`;
            
            // Check if user has already voted
            await checkVotingStatus();
            
            // Load candidates and results
            await loadCandidates();
            await loadResults();
        }
    } catch (error) {
        showMessage(`Initialization error: ${error.message}`, 'error');
        console.error('Initialization error:', error);
    }
}

// Handle account changes
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showMessage('Please connect to MetaMask.', 'error');
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        accountInfo.textContent = `Account: ${shortenAddress(currentAccount)}`;
        await checkVotingStatus();
        await loadResults();
    }
}

// Check if the current account has already voted
async function checkVotingStatus() {
    try {
        hasVoted = await votingContract.methods.voters(currentAccount).call();
    } catch (error) {
        console.error('Error checking voting status:', error);
    }
}

// Load candidates from the contract
async function loadCandidates() {
    try {
        candidatesList.innerHTML = 'Loading candidates...';
        
        // Get candidates from contract
        candidates = await getCandidateList();
        
        if (candidates.length === 0) {
            candidatesList.innerHTML = '<p>No candidates found.</p>';
            return;
        }
        
        // Display candidates
        let candidatesHTML = '';
        for (const candidate of candidates) {
            candidatesHTML += `
                <div class="candidate-card">
                    <div class="candidate-name">${candidate}</div>
                    <button onclick="vote('${candidate}')" ${hasVoted ? 'disabled' : ''}>
                        ${hasVoted ? 'Already Voted' : 'Vote'}
                    </button>
                </div>
            `;
        }
        
        candidatesList.innerHTML = candidatesHTML;
    } catch (error) {
        candidatesList.innerHTML = `<p>Error loading candidates: ${error.message}</p>`;
        console.error('Error loading candidates:', error);
    }
}

// Load voting results
async function loadResults() {
    try {
        resultsContainer.innerHTML = 'Loading results...';
        
        if (candidates.length === 0) {
            resultsContainer.innerHTML = '<p>No results available.</p>';
            return;
        }
        
        // Get votes for each candidate
        let resultsHTML = '';
        for (const candidate of candidates) {
            const votes = await getTotalVotesFor(candidate);
            resultsHTML += `
                <div class="result-item">
                    <span>${candidate}</span>
                    <span class="vote-count">${votes} votes</span>
                </div>
            `;
        }
        
        resultsContainer.innerHTML = resultsHTML;
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error loading results: ${error.message}</p>`;
        console.error('Error loading results:', error);
    }
}

// Vote for a candidate
async function vote(candidate) {
    try {
        if (hasVoted) {
            showMessage('You have already voted!', 'error');
            return;
        }
        
        showMessage('Processing your vote...', 'info');
        
        await voteForCandidate(candidate);
        
        hasVoted = true;
        showMessage(`Successfully voted for ${candidate}!`, 'success');
        
        // Update UI
        await loadCandidates();
        await loadResults();
    } catch (error) {
        showMessage(`Error voting: ${error.message}`, 'error');
        console.error('Error voting:', error);
    }
}

// Get the list of candidates from the contract
async function getCandidateList() {
    try {
        let index = 0;
        const candidatesList = [];
        
        // Keep trying to get candidates until we get an error
        while (true) {
            try {
                const candidate = await votingContract.methods.candidateList(index).call();
                candidatesList.push(candidate);
                index++;
            } catch (error) {
                // We've reached the end of the list
                break;
            }
        }
        
        return candidatesList;
    } catch (error) {
        console.error('Error getting candidate list:', error);
        throw error;
    }
}

// Vote for a candidate
async function voteForCandidate(candidate) {
    try {
        await votingContract.methods.voteForCandidate(candidate).send({ from: currentAccount });
    } catch (error) {
        console.error(`Error voting for ${candidate}:`, error);
        throw error;
    }
}

// Get total votes for a candidate
async function getTotalVotesFor(candidate) {
    try {
        const votes = await votingContract.methods.totalVotesFor(candidate).call();
        return votes;
    } catch (error) {
        console.error(`Error getting votes for ${candidate}:`, error);
        throw error;
    }
}

// Helper function to shorten address
function shortenAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Show message to the user
function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = '';
    messageContainer.classList.add(type);
    
    // Clear message after 5 seconds if it's a success message
    if (type === 'success') {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}

// Initialize the application when the page loads
window.onload = init;
