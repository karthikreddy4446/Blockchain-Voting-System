# Blockchain Voting System

A decentralized voting application built on Ethereum blockchain that allows users to vote for candidates securely and transparently. The system uses smart contracts to ensure voting integrity and prevent double voting.

## Features

- **Decentralized Voting**: All votes are recorded on the Ethereum blockchain
- **One Vote Per Address**: Smart contract prevents the same account from voting twice
- **Real-time Results**: View voting results instantly as they're updated on the blockchain
- **MetaMask Integration**: Seamlessly connect with MetaMask wallet or use local Ganache network
- **Responsive UI**: Works on desktop and mobile devices
- **Secure**: Voting data is immutable and transparent

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Ganache CLI** or **Ganache GUI** (for local blockchain development)
- **MetaMask** browser extension (optional, for production networks)
- **Truffle** (for smart contract compilation and deployment)

## Installation

1. **Clone the repository**
   ```bash
   cd voting-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Ganache CLI** (if not already installed)
   ```bash
   npm install -g ganache-cli
   ```

4. **Install Truffle** (if not already installed)
   ```bash
   npm install -g truffle
   ```

## Project Structure

```
voting-system/
├── contracts/
│   └── Voting.sol              # Smart contract for voting logic
├── migrations/
│   └── 1_deploy_voting.js      # Migration script for contract deployment
├── frontend/
│   ├── index.html              # Main voting interface
│   ├── script.js               # Web3 integration and frontend logic
│   ├── style.css               # Styling
│   └── admin.html              # Admin interface
├── backend/
│   ├── server.js               # Backend server (Express.js)
│   └── blockchain.js           # Blockchain utility functions
├── build/                      # Compiled contract artifacts
├── truffle-config.js           # Truffle configuration
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## Quick Start

### 1. Start Ganache

```bash
ganache-cli --port 7545
```

Or open Ganache GUI and ensure it's running on port 7545.

### 2. Compile Smart Contract

```bash
truffle compile
```

This compiles the Solidity smart contract and generates ABI and bytecode.

### 3. Deploy Smart Contract

```bash
truffle migrate
```

This deploys the `Voting` contract to the Ganache network. The contract is initialized with 5 candidates:
- Karthik
- Sadwik
- Anirudh
- Nikhil
- Ganesh

**Important**: Note the deployed contract address and update it in `frontend/script.js` if needed.

### 4. Open Frontend

Open the frontend in your browser:
```
frontend/index.html
```

The application will automatically:
- Detect MetaMask or connect to Ganache
- Load the list of candidates
- Display current voting results
- Allow you to vote

### 5. (Optional) Start Backend Server

```bash
node server.js
```

The backend server provides utility functions for blockchain interactions (currently for testing purposes).

## How It Works

### Smart Contract Flow

1. **Contract Deployment**: The `Voting` smart contract is deployed with an initial list of candidates
2. **User Connection**: User connects via MetaMask or uses Ganache accounts
3. **Vote Submission**: User selects a candidate and submits their vote
4. **Vote Processing**: Smart contract validates:
   - Candidate is valid
   - User hasn't already voted
   - User has sufficient gas
5. **Vote Recording**: Vote is recorded on blockchain and vote counter is incremented
6. **Results Update**: Frontend displays updated voting results in real-time

### Smart Contract Functions

#### Constructor
```solidity
constructor(string[] memory candidateNames)
```
Initializes the contract with candidate names.

#### voteForCandidate
```solidity
function voteForCandidate(string memory candidate) public
```
Casts a vote for the specified candidate. Prevents double voting and validates candidate.

#### totalVotesFor
```solidity
function totalVotesFor(string memory candidate) public view returns (uint256)
```
Returns total votes received by a candidate.

#### isValidCandidate
```solidity
function isValidCandidate(string memory candidate) public view returns (bool)
```
Checks if a candidate exists in the candidate list.

## Usage

### Voting

1. Open `frontend/index.html` in your browser
2. Connect your MetaMask wallet or ensure Ganache is running
3. View the list of candidates
4. Click the "Vote" button for your preferred candidate
5. Confirm the transaction in MetaMask or wait for Ganache to process it
6. Once confirmed, the results update automatically
7. Your vote button becomes disabled to prevent double voting

### Checking Results

- Results update in real-time as votes are cast
- Each candidate shows their current vote count
- The interface displays:
  - Your current account address
  - Connection status (Ethereum network or Ganache)
  - All candidates with vote buttons
  - Live voting results

## Troubleshooting

### "Connection Failed" Error
- Ensure Ganache is running on `http://localhost:7545`
- Check that your MetaMask is connected to the correct network
- Try refreshing the page

### "Contract Address Not Found"
- Update the contract address in `frontend/script.js` line 57 with the deployed contract address from the migration output
- Ensure the contract has been deployed with `truffle migrate`

### "You have already voted" Error
- Each Ethereum address can only vote once
- To vote again, switch to a different account in MetaMask or use a different Ganache account

### Ganache Not Running
```bash
ganache-cli --port 7545
```

### Contract Compilation Error
- Ensure Solidity version matches in `truffle-config.js` (currently 0.8.13)
- Check for syntax errors in `contracts/Voting.sol`

## Network Configuration

### Development (Ganache)
- **Network ID**: 5777
- **RPC URL**: http://localhost:7545
- **Gas Limit**: 6721975
- **Pre-funded Accounts**: 10 accounts with 100 ETH each

### Production
To deploy on a public network (Ropsten, Mainnet, etc.):
1. Update `truffle-config.js` with the network configuration
2. Set up environment variables for private keys
3. Run `truffle migrate --network <network-name>`

## Important Notes

- This is a demonstration project for educational purposes
- In production, add access controls and additional security measures
- Consider gas optimization for large-scale deployments
- Add proper error handling and validation
- Implement proper authentication mechanism

## Technologies Used

- **Solidity**: Smart contract development
- **Web3.js**: Ethereum blockchain interaction
- **Truffle**: Smart contract development framework
- **Ganache**: Local Ethereum blockchain
- **Express.js**: Backend API
- **HTML/CSS/JavaScript**: Frontend interface
- **MetaMask**: Wallet integration

## License

MIT License - Feel free to use this project for learning purposes.

## Author

**Sargari Karthik Reddy**

## Support

For issues or questions, please check:
1. Ganache is running on port 7545
2. Smart contract is deployed and address is correct
3. Browser console for detailed error messages
4. MetaMask is connected to the correct network
