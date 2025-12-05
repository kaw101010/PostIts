import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

function CreatePost({ onPostCreated }) {
  const { publicKey } = useWallet();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || !publicKey) return;

    setPosting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        onPostCreated(newPost);
        setContent('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-gradient rounded-xl p-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-solana-purple to-solana-green flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold">
            {publicKey?.toBase58().slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? (max 280 characters)"
            maxLength={280}
            rows={3}
            className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-gray-500 text-lg"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <span className={`text-sm ${content.length > 250 ? 'text-yellow-400' : 'text-gray-500'}`}>
              {content.length}/280
            </span>
            <button
              type="submit"
              disabled={!content.trim() || posting}
              className="solana-button px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreatePost;
