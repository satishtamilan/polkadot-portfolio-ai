# 🪙 Testnet Tokens Guide

## ✅ Current Configuration

Your app is now configured with **3 easy testnets** that all use the **same address format**:

| Network | Token | Mock Price | Faucet |
|---------|-------|------------|--------|
| **Paseo Testnet** | PAS | $7.50 | https://faucet.polkadot.io/westend |
| **Westend Testnet** | WND | $7.50 | https://faucet.polkadot.io/westend |
| **Westend Asset Hub** | WND | $7.50 | https://faucet.polkadot.io/westend |

## 💰 Mock Prices (For Demo)

Since testnet tokens don't have real market prices, I've added **mock prices** so your dashboard looks complete:

- **PAS**: $7.50 (simulating DOT price)
- **WND**: $7.50 (simulating DOT price)  
- **24h Change**: Random between -5% to +5%

This enables:
✅ Total Portfolio Value calculation
✅ 24h Change display
✅ Portfolio Distribution pie chart

## 🎯 What You Should See Now

After refreshing http://localhost:3002, you'll see:

### 1. **Total Value** (Top Section)
- Your total portfolio in USD (e.g., $187.49)
- Based on: (5000 PAS × $7.50) + (10 WND × $7.50) + (10 WND × $7.50)

### 2. **24h Change**
- A percentage showing mock price movement
- Will be green (↑) or red (↓) with a random value

### 3. **Active Chains**
- Should show "3" (all three testnets)

### 4. **Portfolio Distribution Chart**
- Pie chart showing breakdown by chain
- Each chain will have a colored segment

### 5. **Chain Breakdown**
- Individual cards showing value per chain

## 🚀 How to Get Tokens

**Your Polkadot.js Address**: `5F9KfZFTnXqh6xwfd4SbuMzRiD81mdfZAppF3dWE9X...`

### Step 1: Get Westend Tokens
1. Go to: https://faucet.polkadot.io/westend
2. Select "Westend" network
3. Select "Westend Relay Chain"
4. Paste your address
5. Complete CAPTCHA → Get tokens

### Step 2: Get Paseo Tokens
1. Go to: https://faucet.polkadot.io/westend
2. Select "Polkadot testnet (Paseo)" network
3. Select "Paseo Relay"
4. Paste your address
5. Complete CAPTCHA → Get tokens

### Step 3: Refresh Your App
- Wait 30 seconds
- Refresh http://localhost:3002
- You'll see balances AND USD values! 🎉

## 📊 For Hackathon Demo

This setup is **perfect for hackathon** because:

✅ Shows multi-chain tracking
✅ Displays professional-looking USD values
✅ Has working pie chart visualization
✅ All networks use same address format
✅ Easy to get free testnet tokens
✅ Demonstrates error handling (one chain can fail, others work)

## 🎨 Technical Note

Mock prices are generated in:
- `/app/src/lib/api/prices.ts`
- `MOCK_TESTNET_PRICES` constant

To switch back to mainnet later, just update:
- `/app/src/lib/utils/constants.ts`
- `/app/src/contexts/MultiChainContext.tsx` (line 42)

