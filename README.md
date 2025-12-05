# PostIts

A decentralized social platform built on Solana where users can share posts and tip each other with SOL.

## Features

- **Wallet Integration**: Connect with Phantom, Solflare, or other Solana wallets
- **Social Posts**: Share thoughts with a 280-character limit (like Twitter)
- **SOL Tipping**: Send tips directly to content creators on Solana devnet
- **Reputation System**: Earn reputation through posts and received tips
- **Leaderboard**: See the top contributors in the community
- **User Profiles**: View post history and reputation for any wallet

## Tech Stack

### Backend
- Python 3
- Flask (REST API)
- solanapy (Solana Python SDK)

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- @solana/wallet-adapter (wallet connection)
- @solana/web3.js (Solana interactions)

## Getting Started

### Prerequisites
- Python 3.x
- Node.js 18+
- A Solana wallet (Phantom or Solflare recommended)
- Devnet SOL for tipping (free from [Solana Faucet](https://faucet.solana.com/))

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd postits
```

2. Install backend dependencies
```bash
cd server
pip install flask flask-cors solana requests
```

3. Install frontend dependencies
```bash
cd client
npm install
```

### Running the App

1. Start the backend server (port 8000):
```bash
cd server
python app.py
```

2. Start the frontend dev server (port 5000):
```bash
cd client
npm run dev
```

3. Open your browser and navigate to the app URL

## How It Works

### Creating Posts
1. Connect your Solana wallet
2. Write your post (max 280 characters)
3. Click "Post" to share with the community

### Tipping
1. Find a post you appreciate
2. Click "Tip" and enter the amount (in SOL)
3. Approve the transaction in your wallet
4. The SOL is sent directly to the post author's wallet

### Reputation
Your reputation score is calculated as:
- +10 points for each 0.001 SOL received in tips
- +2 points for each post created

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   Flask     │────▶│   Solana    │
│   Frontend  │◀────│   Backend   │◀────│   Devnet    │
└─────────────┘     └─────────────┘     └─────────────┘
     :5000              :8000
```

- Frontend handles wallet connections and transaction signing
- Backend stores posts/tips and calculates reputation
- Solana devnet processes SOL transfers for tipping

## Demo

This application runs on Solana devnet. No real SOL is required - get free devnet SOL from the [Solana Faucet](https://faucet.solana.com/).

## Future Improvements

- Persistent database storage (PostgreSQL)
- On-chain post storage
- Signature verification for posts
- Following/followers system
- Post comments and reactions
- NFT profile pictures

## License

MIT License

## Hackathon Submission

Built for demonstrating social interactions on Solana blockchain with real token transfers for creator monetization.
