import React, { useState, useEffect } from 'react';

function Leaderboard({ onViewProfile }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaders(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

  const getReputationLevel = (score) => {
    if (score >= 500) return { level: 'Legend', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (score >= 200) return { level: 'Expert', color: 'text-purple-400', bg: 'bg-purple-400/10' };
    if (score >= 100) return { level: 'Rising Star', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (score >= 50) return { level: 'Active', color: 'text-green-400', bg: 'bg-green-400/10' };
    return { level: 'Newcomer', color: 'text-gray-400', bg: 'bg-gray-400/10' };
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">Reputation Leaderboard</h2>
        <p className="text-gray-400">Top creators ranked by tips received and engagement</p>
      </div>

      {leaders.length === 0 ? (
        <div className="card-gradient rounded-xl p-8 text-center">
          <p className="text-gray-400">No users on the leaderboard yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((user, index) => {
            const reputation = getReputationLevel(user.reputation_score || 0);
            return (
              <button
                key={user.wallet}
                onClick={() => onViewProfile(user.wallet)}
                className="w-full card-gradient rounded-xl p-4 flex items-center space-x-4 hover:scale-[1.02] transition-all text-left"
              >
                <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold">
                  {getMedalEmoji(index)}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-solana-purple to-solana-green flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold">
                    {user.wallet.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">
                      {formatWallet(user.wallet)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${reputation.color} ${reputation.bg}`}>
                      {reputation.level}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{user.post_count || 0} posts</span>
                    <span>{(user.total_tips_received || 0).toFixed(3)} SOL earned</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold gradient-text">
                    {user.reputation_score || 0}
                  </p>
                  <p className="text-xs text-gray-500">Reputation</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="card-gradient rounded-xl p-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-4">How Reputation Works</h3>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-center space-x-2">
            <span className="text-solana-green">•</span>
            <span>Earn 10 points for every SOL received in tips</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-solana-green">•</span>
            <span>Earn 2 points for every post you create</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-solana-green">•</span>
            <span>Higher reputation unlocks special status levels</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-solana-green">•</span>
            <span>All tips are real SOL transactions on Solana devnet</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
