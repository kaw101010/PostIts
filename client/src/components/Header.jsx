import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

function Header({ currentView, setCurrentView, onBackToFeed }) {
  const { publicKey } = useWallet();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-solana-dark/80 border-b border-solana-purple/20">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToFeed}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src="/solana.svg" alt="Solana" className="w-10 h-10" />
              <h1 className="text-2xl font-bold gradient-text">SolSocial</h1>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('feed')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'feed'
                  ? 'bg-solana-purple/20 text-solana-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'leaderboard'
                  ? 'bg-solana-purple/20 text-solana-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Leaderboard
            </button>
            {publicKey && (
              <button
                onClick={() => {
                  setCurrentView('profile');
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'profile'
                    ? 'bg-solana-purple/20 text-solana-green'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                My Profile
              </button>
            )}
          </nav>

          <WalletMultiButton className="!bg-gradient-to-r !from-solana-purple !to-solana-green !rounded-xl !font-semibold" />
        </div>

        <div className="md:hidden flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setCurrentView('feed')}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentView === 'feed'
                ? 'bg-solana-purple/20 text-solana-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setCurrentView('leaderboard')}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentView === 'leaderboard'
                ? 'bg-solana-purple/20 text-solana-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
          {publicKey && (
            <button
              onClick={() => setCurrentView('profile')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'profile'
                  ? 'bg-solana-purple/20 text-solana-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Profile
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
