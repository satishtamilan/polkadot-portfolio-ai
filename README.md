# ChainLink Portfolio - Polkadot Cross-Chain Activity Tracker

> A user-centric Web3 application built for the [Build Resilient Apps with Polkadot Cloud](https://polkadot.devpost.com/) hackathon.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?logo=polkadot&logoColor=white)

## 🎯 Project Vision

**ChainLink Portfolio** aggregates your Web3 identity and activity across multiple Polkadot parachains into a unified, beautiful dashboard. Own your data, visualize your cross-chain presence, and showcase your Web3 footprint.

### Why This Matters

In the Polkadot ecosystem, users interact with multiple parachains (Astar, Moonbeam, Acala, etc.), but each chain operates independently. This creates a **fragmented identity problem** - your complete Web3 presence is scattered across chains. ChainLink Portfolio solves this by leveraging Polkadot's cross-chain architecture to give users a complete view of their blockchain activity.

## ✨ Key Features

- 🔗 **Multi-Chain Aggregation** - View assets across 4 Polkadot parachains in one place
- 💰 **Portfolio Dashboard** - Real-time balances, tokens, and portfolio value tracking
- 📊 **Data Visualization** - Charts showing portfolio composition and distribution
- 🤖 **AI Portfolio Advisor** - Get personalized insights and recommendations powered by Groq API
- 📈 **Health Score** - Comprehensive portfolio health analysis based on diversification and risk
- 🌉 **XCM Cross-Chain Transfers** - Execute real cross-chain asset transfers using XCM protocol
- 🔐 **Privacy-First** - Client-side aggregation, you control your data
- 📱 **Mobile Responsive** - Beautiful interface on any device
- 🎨 **Modern UI** - Web2-quality user experience in Web3
- 🔄 **Auto-Refresh** - Real-time updates every 30 seconds
- 💵 **USD Values** - Real-time token prices from CoinGecko

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Polkadot.js API, XCM Protocol
- **Wallet**: Polkadot.js Extension
- **AI**: Groq API with Llama 3.1 8B Instant
- **Visualization**: Recharts
- **APIs**: CoinGecko (pricing data)
- **Target Chains**: 
  - Polkadot Relay Chain (Paseo Testnet)
  - Astar Network
  - Moonbeam
  - Paseo Asset Hub

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- [Polkadot.js browser extension](https://polkadot.js.org/extension/)
- Groq API Key (for AI features) - Get one at [console.groq.com](https://console.groq.com)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chainlink-portfolio.git
cd chainlink-portfolio
```

2. **Install dependencies**
```bash
cd app
pnpm install
```

3. **Set up environment variables**
```bash
# Create .env.local in the app directory
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local
```

4. **Run the development server**
```bash
pnpm dev
```

5. **Open your browser**
```
http://localhost:3000
```

### Setup Wallet

1. Install [Polkadot.js Extension](https://polkadot.js.org/extension/)
2. Create or import an account
3. Click "Connect Wallet" in the app
4. Approve the connection in the extension
5. View your cross-chain portfolio!

## 📖 How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│         User Browser (Client)           │
├─────────────────────────────────────────┤
│  Next.js App + Polkadot.js Extension   │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   WalletContext                  │  │
│  │   (Connection Management)        │  │
│  └──────────────────────────────────┘  │
│                │                        │
│  ┌──────────────────────────────────┐  │
│  │   MultiChainContext              │  │
│  │   (Data Aggregation)             │  │
│  └──────────────────────────────────┘  │
│         │        │        │        │    │
└─────────┼────────┼────────┼────────┼────┘
          │        │        │        │
          ▼        ▼        ▼        ▼
     ┌────────┬────────┬────────┬────────┐
     │Polkadot│ Astar  │Moonbeam│ Acala  │
     │  RPC   │  RPC   │  RPC   │  RPC   │
     └────────┴────────┴────────┴────────┘
          │        │        │        │
          ▼        ▼        ▼        ▼
     ┌────────────────────────────────────┐
     │    Polkadot Parachain Networks     │
     └────────────────────────────────────┘
```

### Data Flow

1. **Wallet Connection**: User connects via Polkadot.js extension
2. **Parallel Queries**: App queries all 4 chains simultaneously using `Promise.allSettled`
3. **Price Fetching**: Token prices fetched from CoinGecko API
4. **Aggregation**: Portfolio calculated from balances + prices
5. **Visualization**: Data displayed in dashboard with charts
6. **Auto-Refresh**: Data refreshes every 30 seconds

### Key Components

- **WalletContext**: Manages wallet connection and account selection
- **MultiChainContext**: Fetches and aggregates data from all chains
- **Chain Cards**: Display balance for individual chains
- **PortfolioSummary**: Shows total value and distribution
- **PortfolioPieChart**: Visualizes asset allocation
- **AIAdvisor**: Provides AI-powered portfolio insights
- **HealthScore**: Calculates and displays portfolio health metrics
- **XCMTransfer**: Executes cross-chain asset transfers using XCM

## 🌉 XCM Cross-Chain Transfers

This project implements **real XCM (Cross-Consensus Message) transfers**, allowing you to move assets between Polkadot parachains seamlessly.

### How XCM Works

XCM is Polkadot's cross-chain communication protocol that enables:
- **Asset Transfers**: Move tokens between parachains
- **Teleportation**: Direct asset transfer for trusted chains
- **Reserve Transfers**: Asset-backed transfers for untrusted chains
- **Cross-Chain Interactions**: Execute remote operations

### Using XCM Transfers

1. Navigate to the XCM Transfer section in the dashboard
2. Select source chain and destination chain
3. Enter recipient address and amount
4. Click "Execute XCM Transfer"
5. Sign the transaction in your wallet

### Supported Transfer Routes

- **Paseo → Westend**: Teleport assets between relay chains
- **Paseo Asset Hub → Westend**: Cross-parachain reserve transfers
- **More routes**: Additional parachain transfers supported

### Technical Implementation

The XCM transfer module uses:
- `limitedTeleportAssets` for trusted chain transfers
- `limitedReserveTransferAssets` for general transfers
- XCM V3 format with proper account encoding
- Transaction status monitoring for confirmations

**Note**: The app uses testnet configurations (Paseo, Westend) for safe testing. Some cross-testnet transfers may not reflect balance changes due to testnet infrastructure limitations, but transactions are successfully submitted on-chain.

## 🏗️ Project Structure

```
chainlink-portfolio/
├── memory/                    # Project constitution
├── specs/                     # Specifications and plans
├── app/                       # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Dashboard page
│   │   └── globals.css       # Global styles
│   └── src/
│       ├── components/
│       │   ├── wallet/       # Wallet components
│       │   ├── chains/       # Chain card components
│       │   ├── dashboard/    # Dashboard layout
│       │   ├── charts/       # Visualization components
│       │   ├── portfolio/    # Portfolio components (HealthScore)
│       │   ├── ai/           # AI Advisor & Floating Chat
│       │   ├── xcm/          # XCM Transfer component
│       │   ├── ui/           # Reusable UI components
│       │   └── layout/       # Header, Footer
│       ├── contexts/         # React contexts
│       │   ├── WalletContext.tsx
│       │   └── MultiChainContext.tsx
│       ├── hooks/            # Custom React hooks
│       │   ├── useChainBalance.ts
│       │   └── usePrices.ts
│       ├── lib/
│       │   ├── chains/       # Chain integration logic
│       │   │   ├── polkadot.ts
│       │   │   ├── astar.ts
│       │   │   ├── moonbeam.ts
│       │   │   └── acala.ts
│       │   ├── api/          # External APIs
│       │   │   └── prices.ts
│       │   ├── ai/           # AI service (Groq)
│       │   │   └── groq.ts
│       │   ├── xcm/          # XCM transfer logic
│       │   │   └── transfer.ts
│       │   ├── polkadot/     # Wallet connection
│       │   └── utils/        # Utilities
│       │       ├── constants.ts
│       │       ├── portfolio.ts
│       │       └── healthScore.ts
│       └── types/            # TypeScript types
│           ├── wallet.ts
│           ├── chain.ts
│           ├── portfolio.ts
│           └── xcm.ts
└── README.md                 # This file
```

## 🎓 Learning Resources

This project includes extensive inline documentation explaining blockchain concepts:

- **Wallet Management**: How Web3 wallets work
- **Account Balances**: Free, reserved, and frozen balances
- **Token Decimals**: How tokens are stored and formatted
- **RPC Connections**: Connecting to blockchain nodes
- **Parallel Queries**: Efficient data fetching strategies
- **Error Handling**: Graceful failure management
- **XCM Protocol**: Cross-chain messaging and asset transfers
- **AI Integration**: Using language models for portfolio analysis
- **Portfolio Metrics**: Health scoring and risk analysis

## 🔧 Configuration

### Supported Chains

All chain configurations are in `src/lib/utils/constants.ts`:

```typescript
export const CHAINS = {
  polkadot: {
    rpc: 'wss://rpc.polkadot.io',
    explorer: 'https://polkadot.subscan.io',
    decimals: 10,
    // ...
  },
  // ... other chains
}
```

### Refresh Intervals

```typescript
export const REFRESH_INTERVALS = {
  chainData: 30 * 1000,  // 30 seconds
  prices: 5 * 60 * 1000   // 5 minutes
};
```

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Workflow

This project uses [Spec-Kit](https://github.com/github/spec-kit) methodology:

1. ✅ **Constitution** - Project principles defined
2. ✅ **Specification** - Features specified
3. ✅ **Implementation Plan** - Technical strategy
4. ✅ **Task Breakdown** - Actionable tasks
5. ✅ **Implementation** - Systematic development

See `specs/001-chainlink-portfolio/` for detailed planning documents.

## 🎯 Hackathon Criteria

### User-Centric Design ✓
- Solves real user pain point (fragmented identity)
- Privacy-first architecture
- Beautiful, intuitive UX
- Accessible to non-technical users

### Polkadot Cloud Integration ✓
- Showcases multi-chain capabilities
- Demonstrates cross-chain aggregation
- Uses Polkadot.js API
- Targets multiple parachains

### Technical Excellence ✓
- Clean, well-documented code
- Type-safe TypeScript
- Efficient parallel queries
- Error handling and recovery
- Mobile responsive design

## 📊 Complete Features

### Multi-Chain Portfolio Management
✅ **Wallet Integration**: Seamless connection with Polkadot.js extension  
✅ **Multi-Chain Support**: Polkadot, Astar, Moonbeam, Paseo Asset Hub  
✅ **Real-Time Pricing**: Live token prices from CoinGecko API  
✅ **Portfolio Aggregation**: Unified view of all your cross-chain assets  
✅ **USD Calculations**: Total portfolio value in fiat currency

### Data Visualization
✅ **Interactive Pie Chart**: Visual breakdown of portfolio distribution  
✅ **Chain Cards**: Individual balance cards for each parachain  
✅ **Portfolio Summary**: Total value, best performer, asset count  
✅ **Responsive Design**: Beautiful UI on desktop and mobile  
✅ **Auto-Refresh**: Data updates every 30 seconds

### AI-Powered Insights
✅ **Portfolio Analysis**: AI-generated insights about your holdings  
✅ **Personalized Recommendations**: Allocation and staking strategies  
✅ **Interactive Chat**: Ask questions about your portfolio  
✅ **Polkadot-Specific Advice**: XCM opportunities and parachain strategies  
✅ **Floating Chat Widget**: Non-intrusive bottom-right placement

### Portfolio Health Score
✅ **Comprehensive Scoring**: 0-100 health rating  
✅ **Diversification Analysis**: Measures spread across chains  
✅ **Risk Balance**: Evaluates portfolio composition  
✅ **Activity Tracking**: Monitors account engagement  
✅ **Visual Breakdown**: Color-coded health indicator

### XCM Cross-Chain Transfers
✅ **Real XCM Implementation**: Execute actual cross-chain transfers  
✅ **Multiple Transfer Types**: Teleport and reserve transfers  
✅ **Route Selection**: Choose source and destination chains  
✅ **Transaction Confirmation**: On-chain submission verification  
✅ **Testnet Safe**: Uses Paseo and Westend for safe testing

## 🚦 Roadmap

### Post-Hackathon Enhancements
- [ ] Transaction history tracking
- [ ] NFT gallery across chains
- [ ] DeFi position tracking
- [ ] Governance participation view
- [ ] Historical portfolio analytics
- [ ] Export to CSV functionality
- [ ] Mobile app (React Native)
- [ ] Support for more parachains

## 🐛 Known Limitations

- **Testnet Environment**: Uses Paseo and Westend testnets for safe demo purposes
- **Cross-Testnet XCM**: Some XCM transfers between different testnets may not reflect balance changes due to infrastructure limitations
- **Public RPCs**: Using free public endpoints (may have rate limits)
- **Price Data**: Dependent on CoinGecko API availability; testnet tokens use mock prices
- **Browser Only**: Requires browser with Polkadot.js extension
- **No Backend**: All data fetched client-side for privacy
- **AI Rate Limits**: Groq API has rate limits on free tier

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Built for the Build Resilient Apps with Polkadot Cloud hackathon by a Web3 learner exploring the Polkadot ecosystem.

## 🙏 Acknowledgments

- **Web3 Foundation** and **Polkadot** team for the amazing ecosystem
- **Parity Technologies** for Polkadot.js and documentation
- **Astar**, **Moonbeam**, and **Acala** teams for parachain documentation
- **CoinGecko** for token price API
- **Groq** for providing fast AI inference API
- **XCM Working Group** for cross-chain protocol documentation
- **Spec-Kit** by GitHub for project methodology

## 📞 Support

- 📖 [Polkadot Wiki](https://wiki.polkadot.network/)
- 💬 [Polkadot Stack Exchange](https://substrate.stackexchange.com/)
- 🎮 [Polkadot Discord](https://dot.li/discord)

---

**Status**: 🚀 Active Development  
**Deadline**: November 17, 2025  
**Theme**: User-Centric Apps  
**Hackathon**: [Build Resilient Apps with Polkadot Cloud](https://polkadot.devpost.com/)

**Built with ❤️ for the Polkadot ecosystem**
