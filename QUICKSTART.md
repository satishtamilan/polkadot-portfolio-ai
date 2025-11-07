# ChainLink Portfolio - Quick Start

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies

```bash
cd app
pnpm install
```

### Step 2: Start Development Server

```bash
pnpm dev
```

The app will be available at **http://localhost:3000**

### Step 3: Install Polkadot.js Extension

1. Go to [polkadot.js.org/extension](https://polkadot.js.org/extension/)
2. Click "Download" for your browser (Chrome, Firefox, or Brave)
3. Install the extension
4. Create a new account or import an existing one

### Step 4: Connect Your Wallet

1. Open the app at http://localhost:3000
2. Click **"Connect Wallet"** button in the top right
3. Approve the connection in the Polkadot.js extension popup
4. Select your account

### Step 5: View Your Portfolio

That's it! You should now see:
- ✅ Your wallet address connected
- ✅ Balances from 4 chains (Polkadot, Astar, Moonbeam, Acala)
- ✅ Total portfolio value in USD
- ✅ Portfolio distribution pie chart

## 🎯 What You Can Do

- **View Balances**: See your token balances across all 4 chains
- **Check Portfolio Value**: Total USD value updated every 30 seconds
- **Visualize Distribution**: See how your assets are distributed
- **Switch Accounts**: Select different accounts from your wallet
- **Explore Chains**: Click "View on Explorer" to see details on block explorers

## 🔧 Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 📝 Important Notes

### About Data

- **Real-Time**: Balances refresh every 30 seconds
- **Prices**: Token prices from CoinGecko API
- **Privacy**: All data fetched client-side, nothing stored

### If You Don't See Balances

This is normal if:
- You don't have any tokens on these chains
- The RPC endpoints are slow to respond
- You're using a new/test account

### Network Requirements

- Queries 4 blockchain RPCs simultaneously
- Fetches prices from CoinGecko
- Requires stable internet connection

## 🐛 Troubleshooting

### "Polkadot.js extension not found"
- Make sure the extension is installed
- Refresh the page after installing
- Check that the extension is enabled

### "No accounts found"
- Create an account in the Polkadot.js extension
- Make sure the account isn't locked
- Try refreshing the page

### Chains Not Loading
- Some public RPCs may be slow or rate-limited
- Try refreshing the page
- Check browser console for errors

### Price Data Not Showing
- CoinGecko API may be rate-limited
- Prices will show as $0.00 if unavailable
- Try again after a few minutes

## 🎨 Features Implemented

### ✅ Phase 1 - Foundation
- Wallet connection with Polkadot.js
- Polkadot Relay Chain integration
- Basic dashboard UI

### ✅ Phase 2 - Multi-Chain
- Astar, Moonbeam, Acala integration
- Parallel chain queries
- Price API integration
- Portfolio aggregation

### ✅ Phase 3 - Visualization
- Portfolio pie chart
- USD value calculations
- Mobile responsive design
- Loading states and error handling

## 📖 Next Steps

1. **Explore the Code**: Check out the well-commented source code
2. **Read the Docs**: See [README.md](README.md) for full documentation
3. **View Specs**: Check `specs/` folder for detailed planning
4. **Customize**: Modify colors, add features, experiment!

## 🤝 Need Help?

- Check the [README](README.md) for detailed info
- Read inline code comments (extensive!)
- Open an issue on GitHub
- Join Polkadot Discord for ecosystem help

---

**Happy Exploring! 🚀**


