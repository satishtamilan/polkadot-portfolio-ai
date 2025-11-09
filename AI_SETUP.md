# 🤖 AI Features Setup

## ✅ What's Added

Your app now has **AI Portfolio Advisor** powered by Groq!

### Features:
- 🧠 **Portfolio Analysis**: AI analyzes your holdings and provides insights
- 💬 **Chat Interface**: Ask questions about your portfolio
- 💡 **Personalized Recommendations**: Staking, DeFi, diversification strategies
- ⚡ **Real-time**: Uses your actual portfolio data

---

## 🚀 Setup (2 minutes)

### Step 1: Set Your API Key

Create `/Users/sanandhan/code/polkadot/app/.env.local` file:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

**Get your FREE API key from:** https://console.groq.com/keys

### Step 2: Restart Server

```bash
cd /Users/sanandhan/code/polkadot/app
# Kill existing server (Ctrl+C)
pnpm dev
```

### Step 3: Test It!

1. Go to http://localhost:3002
2. Connect your wallet
3. Scroll down to **"AI Portfolio Advisor"**
4. Click **"Analyze My Portfolio"**

---

## 🎯 How to Use

### **Insights Mode** (Default)
- Click "Analyze My Portfolio"
- AI provides:
  - Risk assessment
  - Top 3 recommendations  
  - Yield opportunities
- Click "Refresh Insights" for updated analysis

### **Chat Mode**
- Switch to "Chat" tab
- Ask questions like:
  - "Should I stake my tokens?"
  - "How should I diversify?"
  - "What are the best DeFi opportunities?"
  - "How risky is my portfolio?"

---

## 💡 Example Insights

**Your Portfolio:**
- Polkadot: 5000 DOT ($37,500) - 99.8%
- Astar: 10 ASTR ($0.70) - 0.1%
- Moonbeam: 10 GLMR ($2.50) - 0.1%

**AI Analysis:**
```
⚠️ Risk Assessment:
Your portfolio shows HIGH CONCENTRATION RISK with 99.8% in DOT.
While DOT is solid, diversification would reduce volatility exposure.

💡 Top 3 Recommendations:
1. Stake 3000 DOT (60%) in Nomination Pools for 15% APY
2. Move 1500 DOT (30%) to Astar and stake for 12% APY via dApp staking
3. Allocate 500 DOT (10%) to Moonbeam for DeFi liquidity pools

🎯 Yield Opportunities:
- Polkadot Nomination Pools: 15% APY (minimum 1 DOT)
- Astar dApp Staking: 12% APY (support dApps, earn rewards)
- Moonbeam DEXs (BeamSwap): 8-20% APY (liquidity pools)
```

---

## 🔧 Technical Details

### AI Model:
- **Provider**: Groq (FREE tier)
- **Model**: Llama 3.1 70B Versatile
- **Cost**: FREE (14,400 requests/day)
- **Speed**: ~500 tokens/sec (very fast!)

### Files Added:
```
app/src/lib/ai/groq.ts           - AI service
app/src/components/ai/AIAdvisor.tsx  - UI component
```

### API Usage:
- Each analysis: ~600 tokens
- Each chat message: ~400 tokens
- Daily limit: 14,400 requests (plenty for hackathon!)

---

## 🏆 For Hackathon Demo

### Demo Script:
1. **Connect wallet** → Show multi-chain balances
2. **Scroll to AI Advisor** → Click "Analyze My Portfolio"
3. **Wait 2-3 seconds** → AI generates insights
4. **Switch to Chat** → Ask "Should I stake my tokens?"
5. **Wow judges!** 🎉

### Key Points to Mention:
- ✅ "AI analyzes REAL portfolio data from blockchain"
- ✅ "Uses Groq's fast AI (Llama 3.1 70B model)"
- ✅ "Provides Polkadot-specific recommendations"
- ✅ "Natural language interface for Web3"
- ✅ "Combines multi-chain tracking + AI insights"

---

## 🐛 Troubleshooting

### "Failed to generate insights"
- Check `.env.local` has correct API key
- Restart server after adding `.env.local`
- Check API key at https://console.groq.com/keys

### "Please connect your wallet"
- Connect Polkadot.js wallet first
- Make sure you have balances on chains

### Server not starting
- Make sure `.env.local` file exists in `/app` directory
- Check file permissions

---

## 🎨 Customization

Want to change AI behavior? Edit:
```typescript
// app/src/lib/ai/groq.ts

// Line 28-35: System prompt
content: `You are an expert Polkadot ecosystem portfolio advisor...`
```

Want different questions? Edit:
```typescript
// app/src/components/ai/AIAdvisor.tsx

// Line 97-102: Suggested questions
const suggestedQuestions = [
  "Your custom question here",
  ...
];
```

---

## ✅ Ready!

Your AI advisor is ready to impress hackathon judges! 🚀

**Next**: Test it with your wallet and prepare your demo!

