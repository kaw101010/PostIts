# SolSocial - Solana Social Application

## Overview
SolSocial is a decentralized social platform built on the Solana blockchain. Users can connect their Solana wallets, create posts, tip other users with SOL, and build reputation within the community.

## Project Structure
```
server/
  app.py           # Flask backend API (port 8000)
client/
  src/
    App.jsx        # Main app with Solana wallet providers
    components/
      Header.jsx       # Navigation and wallet connection
      Feed.jsx         # Social feed display
      CreatePost.jsx   # Post creation form
      PostCard.jsx     # Individual post display with tipping
      Profile.jsx      # User profile page
      Leaderboard.jsx  # Top users by reputation
    index.css      # Custom styles
  vite.config.js   # Vite config (port 5000, proxy to backend)
```

## Technology Stack
- **Backend**: Python, Flask, Flask-CORS, solanapy
- **Frontend**: React, Vite, Tailwind CSS
- **Blockchain**: Solana (devnet), @solana/web3.js, @solana/wallet-adapter

## Features
- Wallet connection (Phantom, Solflare supported)
- Post creation (280 character limit)
- Social feed with real-time updates
- SOL tipping on Solana devnet
- User profiles with post history
- Reputation system: (tips_received * 10) + (posts * 2)
- Leaderboard showing top users

## Running the Application
The project uses two workflows:
1. **Backend API**: `cd server && python app.py` (runs on port 8000)
2. **Frontend**: `cd client && npm run dev` (runs on port 5000)

Both workflows should be running for the application to work properly.

## API Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `POST /api/tips` - Record a tip transaction
- `GET /api/users/<wallet>` - Get user profile
- `GET /api/leaderboard` - Get top users by reputation

## Development Notes
- The app uses Solana devnet for testing
- Users need devnet SOL to tip (get from faucet: https://faucet.solana.com/)
- Posts and tips are stored in-memory (demo purposes)
- For production: Add signature verification for posts and transactions

## User Preferences
- None documented yet
