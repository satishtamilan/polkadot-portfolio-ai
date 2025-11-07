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
- 🔐 **Privacy-First** - Client-side aggregation, you control your data
- 📱 **Mobile Responsive** - Beautiful interface on any device
- 🎨 **Modern UI** - Web2-quality user experience in Web3
- 🔄 **Auto-Refresh** - Real-time updates every 30 seconds
- 💵 **USD Values** - Real-time token prices from CoinGecko

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Polkadot.js API
- **Wallet**: Polkadot.js Extension
- **Visualization**: Recharts
- **Target Chains**: 
  - Polkadot Relay Chain
  - Astar Network
  - Moonbeam
  - Acala

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- [Polkadot.js browser extension](https://polkadot.js.org/extension/)

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

3. **Run the development server**
```bash
pnpm dev
```

4. **Open your browser**
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
│       │   ├── polkadot/     # Wallet connection
│       │   └── utils/        # Utilities
│       └── types/            # TypeScript types
│           ├── wallet.ts
│           ├── chain.ts
│           └── portfolio.ts
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

## 📊 Features Overview

### Phase 1 ✅ (Completed)
- Wallet connection with Polkadot.js extension
- Polkadot Relay Chain integration
- Basic dashboard UI
- Account management

### Phase 2 ✅ (Completed)
- Astar, Moonbeam, Acala integration
- Parallel chain queries
- Price API integration (CoinGecko)
- Portfolio aggregation and USD values

### Phase 3 ✅ (Completed)
- Portfolio pie chart visualization
- Mobile responsive design
- Error handling and loading states
- UI polish and animations

### Phase 4 🔄 (In Progress)
- Documentation completion
- Demo video preparation
- Deployment to Vercel
- Hackathon submission

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

- **MVP Read-Only**: No transaction sending (viewing only)
- **Public RPCs**: Using free public endpoints (may have rate limits)
- **Price Data**: Dependent on CoinGecko API availability
- **Browser Only**: Requires browser with Polkadot.js extension
- **No Backend**: All data fetched client-side

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Built for the Build Resilient Apps with Polkadot Cloud hackathon by a Web3 learner exploring the Polkadot ecosystem.

## 🙏 Acknowledgments

- **Web3 Foundation** and **Polkadot** team for the amazing ecosystem
- **Parity Technologies** for Polkadot.js and documentation
- **Astar**, **Moonbeam**, and **Acala** teams for parachain documentation
- **CoinGecko** for token price API
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
