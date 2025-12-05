import React, { useState } from 'react';

function PostCard({ post, onTip, onViewProfile, tipping, currentWallet }) {
  const [tipAmount, setTipAmount] = useState(0.01);
  const [showTipInput, setShowTipInput] = useState(false);

  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const isOwnPost = currentWallet === post.wallet;

  return (
    <div className="card-gradient rounded-xl p-6 transition-all hover:scale-[1.01]">
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onViewProfile(post.wallet)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-solana-purple to-solana-green flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform"
        >
          <span className="text-lg font-bold">
            {post.wallet.slice(0, 2).toUpperCase()}
          </span>
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={() => onViewProfile(post.wallet)}
              className="font-semibold text-white hover:text-solana-green transition-colors"
            >
              {formatWallet(post.wallet)}
            </button>
            <span className="text-gray-500 text-sm">
              {formatTime(post.timestamp)}
            </span>
          </div>
          
          <p className="text-gray-200 text-lg mb-4 break-words">{post.content}</p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-5 h-5 text-solana-green" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472a4.265 4.265 0 01.264-.521z" />
              </svg>
              <span className="font-semibold">{post.tips_received?.toFixed(3) || '0.000'} SOL</span>
              <span className="text-sm">({post.tip_count || 0} tips)</span>
            </div>
            
            {!isOwnPost && currentWallet && (
              <div className="flex items-center space-x-2">
                {showTipInput ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0.01)}
                      className="w-20 px-2 py-1 rounded bg-gray-800 text-white text-sm border border-gray-600 focus:border-solana-green outline-none"
                    />
                    <span className="text-sm text-gray-400">SOL</span>
                    <button
                      onClick={() => {
                        onTip(post.id, post.wallet, tipAmount);
                        setShowTipInput(false);
                      }}
                      disabled={tipping}
                      className="px-3 py-1 bg-solana-green text-black rounded text-sm font-semibold hover:opacity-80 disabled:opacity-50"
                    >
                      {tipping ? '...' : 'Send'}
                    </button>
                    <button
                      onClick={() => setShowTipInput(false)}
                      className="px-2 py-1 text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTipInput(true)}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gradient-to-r from-solana-purple/30 to-solana-green/30 hover:from-solana-purple/50 hover:to-solana-green/50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <span className="text-sm font-semibold">Tip</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
