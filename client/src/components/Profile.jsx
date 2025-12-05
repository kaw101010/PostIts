import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

function Profile({ walletAddress, onBack }) {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const targetWallet = walletAddress || publicKey?.toBase58();

  useEffect(() => {
    if (!targetWallet) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/user/${targetWallet}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetWallet]);

  if (!targetWallet) {
    return (
      <div className="card-gradient rounded-xl p-8 text-center">
        <p className="text-gray-400">Connect your wallet to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-green"></div>
      </div>
    );
  }

  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 8)}...${wallet.slice(-8)}`;
  };

  const getReputationLevel = (score) => {
    if (score >= 500) return { level: 'Legend', color: 'text-yellow-400' };
    if (score >= 200) return { level: 'Expert', color: 'text-purple-400' };
    if (score >= 100) return { level: 'Rising Star', color: 'text-blue-400' };
    if (score >= 50) return { level: 'Active', color: 'text-green-400' };
    return { level: 'Newcomer', color: 'text-gray-400' };
  };

  const reputation = getReputationLevel(profile?.stats?.reputation_score || 0);

  return (
    <div className="space-y-6">
      {walletAddress && (
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Feed</span>
        </button>
      )}

      <div className="card-gradient rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-solana-purple to-solana-green flex items-center justify-center">
            <span className="text-3xl font-bold">
              {targetWallet.slice(0, 2).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              {formatWallet(targetWallet)}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <span className={`text-lg font-semibold ${reputation.color}`}>
                {reputation.level}
              </span>
              <span className="text-gray-400">
                Joined {new Date(profile?.stats?.joined_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-center md:justify-start gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-solana-green">
                  {profile?.balance_sol?.toFixed(4) || '0.0000'}
                </p>
                <p className="text-gray-500 text-sm">SOL Balance</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {profile?.stats?.reputation_score || 0}
                </p>
                <p className="text-gray-500 text-sm">Reputation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-gradient rounded-xl p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {profile?.stats?.post_count || 0}
          </p>
          <p className="text-gray-400 text-sm">Posts</p>
        </div>
        <div className="card-gradient rounded-xl p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {profile?.stats?.total_tips_received?.toFixed(3) || '0.000'}
          </p>
          <p className="text-gray-400 text-sm">SOL Received</p>
        </div>
        <div className="card-gradient rounded-xl p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {profile?.stats?.total_tips_given?.toFixed(3) || '0.000'}
          </p>
          <p className="text-gray-400 text-sm">SOL Given</p>
        </div>
        <div className="card-gradient rounded-xl p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {profile?.posts?.length || 0}
          </p>
          <p className="text-gray-400 text-sm">Total Posts</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Recent Posts</h3>
        {profile?.posts?.length > 0 ? (
          <div className="space-y-4">
            {profile.posts.slice(0, 10).map((post) => (
              <div key={post.id} className="card-gradient rounded-xl p-4">
                <p className="text-gray-200 mb-2">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                  <span className="text-solana-green">
                    {post.tips_received?.toFixed(3) || '0.000'} SOL tips
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-gradient rounded-xl p-8 text-center">
            <p className="text-gray-400">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
