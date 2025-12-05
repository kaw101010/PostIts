import React, { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

function Feed({ onViewProfile }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipping, setTipping] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleTip = async (postId, toWallet, amount = 0.01) => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (publicKey.toBase58() === toWallet) {
      alert('You cannot tip your own post');
      return;
    }

    setTipping(postId);

    try {
      const recipientPubkey = new PublicKey(toWallet);
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      await fetch(`/api/posts/${postId}/tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_wallet: publicKey.toBase58(),
          amount,
          tx_signature: signature,
        }),
      });

      fetchPosts();
      alert(`Successfully tipped ${amount} SOL!`);
    } catch (error) {
      console.error('Error tipping:', error);
      alert('Failed to send tip: ' + error.message);
    } finally {
      setTipping(null);
    }
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
        <h2 className="text-3xl font-bold gradient-text mb-2">Social Feed</h2>
        <p className="text-gray-400">Share thoughts, earn tips, build reputation</p>
      </div>

      {publicKey && <CreatePost onPostCreated={handlePostCreated} />}

      {!publicKey && (
        <div className="card-gradient rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">Connect your wallet to start posting and tipping</p>
          <div className="flex justify-center">
            <img src="/solana.svg" alt="Solana" className="w-16 h-16 opacity-50" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="card-gradient rounded-xl p-8 text-center">
            <p className="text-gray-400">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onTip={handleTip}
              onViewProfile={onViewProfile}
              tipping={tipping === post.id}
              currentWallet={publicKey?.toBase58()}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;
