import React, { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';

function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [selectedProfile, setSelectedProfile] = useState(null);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const handleViewProfile = (wallet) => {
    setSelectedProfile(wallet);
    setCurrentView('profile');
  };

  const handleBackToFeed = () => {
    setSelectedProfile(null);
    setCurrentView('feed');
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen text-white">
            <Header 
              currentView={currentView} 
              setCurrentView={setCurrentView}
              onBackToFeed={handleBackToFeed}
            />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
              {currentView === 'feed' && (
                <Feed onViewProfile={handleViewProfile} />
              )}
              {currentView === 'profile' && (
                <Profile 
                  walletAddress={selectedProfile} 
                  onBack={handleBackToFeed}
                />
              )}
              {currentView === 'leaderboard' && (
                <Leaderboard onViewProfile={handleViewProfile} />
              )}
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
