import os
import json
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from solana.rpc.api import Client
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.system_program import TransferParams, transfer
from solders.transaction import Transaction
from solders.message import Message
import base58

app = Flask(__name__)
CORS(app)

SOLANA_RPC_URL = "https://api.devnet.solana.com"
solana_client = Client(SOLANA_RPC_URL)

posts_db = []
users_db = {}
tips_db = {}

def get_user_stats(wallet_address):
    if wallet_address not in users_db:
        users_db[wallet_address] = {
            "wallet": wallet_address,
            "total_tips_received": 0,
            "total_tips_given": 0,
            "reputation_score": 0,
            "post_count": 0,
            "joined_at": int(time.time() * 1000)
        }
    return users_db[wallet_address]

def calculate_reputation(user_stats):
    tips_received = user_stats.get("total_tips_received", 0)
    post_count = user_stats.get("post_count", 0)
    reputation = (tips_received * 10) + (post_count * 2)
    return min(reputation, 1000)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "network": "devnet"})

@app.route('/api/balance/<wallet_address>', methods=['GET'])
def get_balance(wallet_address):
    try:
        pubkey = Pubkey.from_string(wallet_address)
        response = solana_client.get_balance(pubkey)
        balance_lamports = response.value
        balance_sol = balance_lamports / 1_000_000_000
        return jsonify({
            "wallet": wallet_address,
            "balance_lamports": balance_lamports,
            "balance_sol": balance_sol
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/posts', methods=['GET'])
def get_posts():
    sorted_posts = sorted(posts_db, key=lambda x: x['timestamp'], reverse=True)
    return jsonify(sorted_posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    wallet = data.get('wallet')
    content = data.get('content')
    signature = data.get('signature', '')
    
    if not wallet or not content:
        return jsonify({"error": "Wallet and content required"}), 400
    
    if len(content) > 280:
        return jsonify({"error": "Post content too long (max 280 chars)"}), 400
    
    user_stats = get_user_stats(wallet)
    user_stats["post_count"] += 1
    user_stats["reputation_score"] = calculate_reputation(user_stats)
    
    post = {
        "id": len(posts_db) + 1,
        "wallet": wallet,
        "content": content,
        "timestamp": int(time.time() * 1000),
        "tips_received": 0,
        "tip_count": 0,
        "signature": signature
    }
    posts_db.append(post)
    
    return jsonify(post), 201

@app.route('/api/posts/<int:post_id>/tip', methods=['POST'])
def tip_post(post_id):
    data = request.json
    from_wallet = data.get('from_wallet')
    amount_sol = data.get('amount', 0.01)
    tx_signature = data.get('tx_signature', '')
    
    if not from_wallet:
        return jsonify({"error": "Wallet address required"}), 400
    
    post = next((p for p in posts_db if p['id'] == post_id), None)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    if post['wallet'] == from_wallet:
        return jsonify({"error": "Cannot tip your own post"}), 400
    
    post['tips_received'] += amount_sol
    post['tip_count'] += 1
    
    tipper_stats = get_user_stats(from_wallet)
    tipper_stats["total_tips_given"] += amount_sol
    
    creator_stats = get_user_stats(post['wallet'])
    creator_stats["total_tips_received"] += amount_sol
    creator_stats["reputation_score"] = calculate_reputation(creator_stats)
    
    tip_record = {
        "post_id": post_id,
        "from_wallet": from_wallet,
        "to_wallet": post['wallet'],
        "amount_sol": amount_sol,
        "tx_signature": tx_signature,
        "timestamp": int(time.time() * 1000)
    }
    
    if post_id not in tips_db:
        tips_db[post_id] = []
    tips_db[post_id].append(tip_record)
    
    return jsonify({
        "success": True,
        "post": post,
        "tip": tip_record
    })

@app.route('/api/user/<wallet_address>', methods=['GET'])
def get_user_profile(wallet_address):
    user_stats = get_user_stats(wallet_address)
    user_posts = [p for p in posts_db if p['wallet'] == wallet_address]
    user_posts = sorted(user_posts, key=lambda x: x['timestamp'], reverse=True)
    
    try:
        pubkey = Pubkey.from_string(wallet_address)
        response = solana_client.get_balance(pubkey)
        balance_sol = response.value / 1_000_000_000
    except:
        balance_sol = 0
    
    return jsonify({
        "wallet": wallet_address,
        "stats": user_stats,
        "posts": user_posts,
        "balance_sol": balance_sol
    })

@app.route('/api/user/<wallet_address>/posts', methods=['GET'])
def get_user_posts(wallet_address):
    user_posts = [p for p in posts_db if p['wallet'] == wallet_address]
    user_posts = sorted(user_posts, key=lambda x: x['timestamp'], reverse=True)
    return jsonify(user_posts)

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    users_list = list(users_db.values())
    sorted_users = sorted(users_list, key=lambda x: x.get('reputation_score', 0), reverse=True)
    return jsonify(sorted_users[:20])

@app.route('/api/transfer/prepare', methods=['POST'])
def prepare_transfer():
    data = request.json
    from_wallet = data.get('from_wallet')
    to_wallet = data.get('to_wallet')
    amount_sol = data.get('amount', 0.01)
    
    if not from_wallet or not to_wallet:
        return jsonify({"error": "Both wallet addresses required"}), 400
    
    try:
        amount_lamports = int(amount_sol * 1_000_000_000)
        
        return jsonify({
            "from_wallet": from_wallet,
            "to_wallet": to_wallet,
            "amount_lamports": amount_lamports,
            "amount_sol": amount_sol,
            "network": "devnet"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/transaction/verify', methods=['POST'])
def verify_transaction():
    data = request.json
    signature = data.get('signature')
    
    if not signature:
        return jsonify({"error": "Transaction signature required"}), 400
    
    try:
        from solders.signature import Signature
        sig = Signature.from_string(signature)
        response = solana_client.get_transaction(sig)
        
        if response.value:
            return jsonify({
                "verified": True,
                "signature": signature
            })
        else:
            return jsonify({
                "verified": False,
                "signature": signature,
                "message": "Transaction not found or not confirmed"
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
