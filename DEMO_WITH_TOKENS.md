# Getting Demo Tokens for Your Portfolio

## 🎯 Quick Overview

For hackathon demo purposes, you have 3 options:

1. **FREE Testnet tokens** (Westend) - Takes 5 minutes ⚡ **RECOMMENDED**
2. **Small amount of real tokens** - Costs ~$5-10, shows real USD values
3. **Use someone else's address** - Just for viewing (read-only demo)

---

## Option 1: FREE Testnet Tokens (Westend) ⭐ RECOMMENDED

### Step 1: Get Free Westend Tokens

**Westend Faucet**: https://faucet.polkadot.io/westend

1. Go to the faucet website
2. Paste your Polkadot address from extension
3. Complete simple CAPTCHA
4. **Get 10 WND tokens instantly!** (FREE)

**OR use Matrix Chat Bot**:
1. Join: https://matrix.to/#/#westend_faucet:matrix.org
2. Type: `!drip YOUR_ADDRESS`
3. Get tokens sent immediately

### Step 2: Configure App for Testnet

I've created a testnet config file. To use it:

```bash
cd /Users/sanandhan/code/polkadot/app/src/lib/utils

# Backup your current config
cp constants.ts constants-mainnet.backup.ts

# Use testnet config (copy the example file)
# Open constants-westend.ts.example
# Copy its contents to constants.ts
```

**Or manually update** `constants.ts`:

Change:
```typescript
polkadot: {
  name: 'Polkadot',
  token: 'DOT',
  rpc: 'wss://rpc.polkadot.io',
  // ...
}
```

To:
```typescript
polkadot: {
  name: 'Westend Testnet',
  token: 'WND',
  rpc: 'wss://westend-rpc.polkadot.io',
  decimals: 12,
  // ...
}
```

### Step 3: Restart and Test

```bash
pnpm dev
```

You'll see:
- ✅ 10.0000 WND balance
- ✅ All features working
- ⚠️ USD values will be $0 (test tokens have no value)

### Pros & Cons of Testnet:
✅ **Pros**:
- Completely FREE
- Instant tokens
- Safe to experiment
- Can get more anytime

❌ **Cons**:
- Won't show real USD values
- Says "Testnet" in chain names
- Judges know it's not mainnet

---

## Option 2: Buy Small Amount of Real Tokens 💰

For a more impressive demo with **real USD values**.

### Quick Purchase Guide

**Amount needed**: ~0.1-0.5 DOT (about $5-10)

**Where to buy**:

1. **Kraken** (Easiest for most countries)
   - Sign up: https://www.kraken.com
   - Verify identity (takes 1-2 hours)
   - Buy DOT with card/bank
   - Withdraw to your Polkadot address

2. **Coinbase**
   - Sign up: https://www.coinbase.com
   - Verify identity
   - Buy DOT
   - Send to your address

3. **Binance**
   - Sign up: https://www.binance.com
   - Verify identity
   - Buy DOT
   - Withdraw to Polkadot network

### How to Withdraw to Your Address:

1. In exchange, click "Withdraw DOT"
2. Select network: **"Polkadot"** (NOT Binance Smart Chain!)
3. Paste your address from Polkadot.js extension
4. Amount: 0.1-0.5 DOT
5. Confirm withdrawal
6. Wait 5-15 minutes

### After Purchase:

Your app will show:
- ✅ Real DOT balance
- ✅ Real USD values
- ✅ Live price updates
- ✅ Professional-looking demo

### Pros & Cons:
✅ **Pros**:
- Shows real USD values
- Very impressive for judges
- Can trade/sell later
- Works on mainnet (production)

❌ **Cons**:
- Costs $5-10
- KYC verification needed
- Takes time (1-2 hours for first time)

---

## Option 3: Demo with Someone Else's Address 👀

**Use a public address** that already has tokens (read-only).

### Well-Known Addresses with Balances:

**Polkadot Treasury**:
```
13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB
```

**Parity Technologies**:
```
15kUt2i86LHRWCkE3D9Bg1HZAoc2smhn1fwPzDERTb1BXAkX
```

### How to Demo:

1. **Don't connect your wallet**
2. **Modify code** to hard-code an address for demo:

```typescript
// In WalletContext.tsx or similar
const DEMO_ADDRESS = '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB';

// Use this address instead of connecting wallet
```

3. App queries that address's balances
4. Shows real data from mainnet

### Pros & Cons:
✅ **Pros**:
- FREE
- Shows real balances
- No purchase needed
- Instant

❌ **Cons**:
- Can't show wallet connection flow
- Not YOUR portfolio
- Less impressive for demo
- Can't demonstrate full user experience

---

## 🎬 Recommended for Hackathon Demo

### Best Approach: **Testnet (Option 1)**

**Why?**
- ✅ Shows ALL functionality (wallet connection, queries, etc.)
- ✅ Completely FREE
- ✅ Safe to experiment
- ✅ Judges understand it's a demo
- ✅ Can get unlimited test tokens
- ✅ No risk with real money

**How to present**:
> "For this demo, I'm using Westend testnet with test tokens to demonstrate all functionality. The app works identically on mainnet with real assets."

### Alternative: **Small Real Purchase (Option 2)**

**If you want to impress with real USD values:**
- Buy 0.1 DOT (~$5) on Kraken/Coinbase
- Keep your app on mainnet config
- Show real portfolio values

---

## 🚀 Quick Start: Get Testnet Tokens NOW

**5-minute setup**:

```bash
# 1. Get your address from Polkadot.js extension
# Click the extension → Copy your address

# 2. Go to Westend faucet
open https://faucet.polkadot.io/westend

# 3. Paste address, get 10 WND FREE

# 4. Wait 10 seconds

# 5. Refresh your app
# See 10.0000 WND balance!
```

---

## 📊 Comparison Table

| Option | Cost | Time | Shows USD | Demo Quality | Recommended |
|--------|------|------|-----------|--------------|-------------|
| **Testnet** | FREE | 5 min | No | Good | ⭐⭐⭐⭐⭐ |
| **Buy Real** | $5-10 | 1-2 hrs | Yes | Excellent | ⭐⭐⭐⭐ |
| **Public Address** | FREE | 2 min | Yes | Fair | ⭐⭐ |

---

## 💡 Pro Tips

### For Testnet Demo:
1. Mention it's testnet in your video
2. Say "Production-ready, works on mainnet"
3. Show the wallet connection flow
4. Demonstrate all features

### For Real Token Demo:
1. Only buy what you need ($5-10 worth)
2. Use Kraken for fastest verification
3. Keep private keys secure
4. Can sell back after hackathon

### For Any Demo:
1. Have multiple accounts ready
2. Test everything before recording
3. Show the portfolio visualization
4. Demonstrate responsive design

---

## ⚠️ Important Notes

### Security:
- **NEVER** share your seed phrase
- Only use trusted exchanges
- Use small amounts for testing
- Enable 2FA on exchanges

### Testnet Limitations:
- Test tokens have no value
- Some parachains might not have testnets
- Network might be slower
- Perfect for learning and demos!

---

## 🎯 My Recommendation

**For your hackathon submission:**

Use **Westend testnet** (Option 1) because:
1. ✅ FREE and instant
2. ✅ Shows all functionality
3. ✅ Safe to experiment
4. ✅ Professional enough for judges
5. ✅ Can get unlimited tokens for retakes

**Steps**:
1. Get WND from faucet (2 minutes)
2. Update constants.ts to Westend config (2 minutes)
3. Restart app (1 minute)
4. Record demo with real balances! 🎬

Total time: **5 minutes** and you're ready! 🚀

---

## 🆘 Need Help?

**If faucet doesn't work:**
- Try Matrix chat bot
- Ask in Polkadot Discord
- Use public address as fallback

**If you want real tokens:**
- Kraken is fastest for verification
- Only buy 0.1 DOT (enough for demo)

**Questions?** Let me know and I'll help! 😊

