# Mine & Escape - GameFi Web3 Mining Game

A fully decentralized Web3 mining game built with Next.js, deployed on Somnia Testnet. Players dig for gems, avoid bombs, and earn STT tokens through strategic gameplay.

## 🎮 Game Overview

Mine & Escape is a multi-level survival GameFi experience where players pay STT tokens to enter levels, collect gems by digging, and earn rewards. Hit a bomb and lose everything - no checkpoints, pure risk/reward gameplay.

## 🚀 Live Game

**Contract Addresses (Somnia Testnet):**
- **STT Token**: `0xBC62C6a497F445Ae2FD9967270b5A0a4301DA3E8`
- **GameFi Contract**: `0x3799325E764463655A27C4880E7A9Ee2bC7c5Fa9`
- **Network**: Somnia Testnet (Chain ID: 50312)

## 💰 GameFi Tokenomics

### Entry Fees
- **Level 1**: 0.1 STT
- **Level 2**: 0.2 STT  
- **Level 3**: 0.3 STT
- **Level 4**: 0.4 STT
- **Level 5**: 0.5 STT

### Rewards
- **Gem Conversion**: 10 gems = 1 STT
- **NFT Badge**: Complete all 5 levels to earn soulbound NFT
- **On-Chain Leaderboard**: Permanent ranking system

### Risk Mechanics
- **Hit Bomb**: Lose all entry tokens and collected gems
- **Time Out**: Lose everything if timer reaches zero
- **No Checkpoints**: Fail = restart from Level 1

## 🎯 Game Mechanics

### Level Progression
Each level increases difficulty:
- **Level 1**: 8 gems, 2 bombs, 120 seconds
- **Level 2**: 7 gems, 3 bombs, 100 seconds
- **Level 3**: 6 gems, 4 bombs, 80 seconds
- **Level 4**: 5 gems, 5 bombs, 60 seconds
- **Level 5**: 4 gems, 6 bombs, 45 seconds

### Gameplay
1. **Connect Wallet** - MetaMask or WalletConnect
2. **Get STT Tokens** - Use faucet for testing
3. **Select Level** - Pay entry fee
4. **Dig Mine** - Click cells to reveal gems/bombs
5. **Collect Gems** - Find all gems to complete level
6. **Cash Out** - Exit anytime to convert gems to STT

## 🛠 Tech Stack

### Frontend
- **Next.js 15** + TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Zustand** for state management

### Web3 Integration
- **Wagmi v2** + **RainbowKit** for wallet connection
- **Viem** for blockchain interactions
- **Smart Contracts** in Solidity

### Blockchain
- **Somnia Testnet** (50312)
- **ERC20 Token** (STT)
- **ERC721 NFT** (Completion Badge)
- **On-Chain Leaderboard**

## 📦 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd mine-escape-game
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
PRIVATE_KEY=your_private_key_for_deployment
```

### 4. Run Development Server
```bash
pnpm dev
```

## 🔧 Smart Contract Deployment

### Deploy to Somnia Testnet
```bash
# Deploy contracts
npx hardhat run scripts/deploy-gamefi.js --network somniaTestnet

# Fund contract with STT tokens
npx hardhat run scripts/fund-contract.js --network somniaTestnet

# Get test STT tokens
npx hardhat run scripts/test-faucet.js --network somniaTestnet
```

### Contract Functions
- `startLevel(uint256 level)` - Pay entry fee and start level
- `completeLevel(uint256 gems)` - Complete level with gems collected
- `exitGame(uint256 gems)` - Cash out current gems
- `failGame()` - Called when player hits bomb/times out
- `getGameSession(address)` - Get player's current session
- `getLeaderboard()` - Get top 100 players

## 🎮 How to Play

### Getting Started
1. **Add Somnia Testnet** to MetaMask:
   - Network: Somnia Testnet
   - RPC: `https://dream-rpc.somnia.network`
   - Chain ID: 50312
   - Symbol: STT

2. **Add STT Token** to wallet:
   - Address: `0xBC62C6a497F445Ae2FD9967270b5A0a4301DA3E8`
   - Symbol: STT
   - Decimals: 18

3. **Get Test Tokens**:
   - Click "Get Free STT" in game
   - Or call faucet function directly

### Game Strategy
- **Start with Level 1** - Lowest risk, learn mechanics
- **Collect gems carefully** - Each click could be a bomb
- **Watch the timer** - Don't run out of time
- **Cash out strategically** - Exit with gems or risk it all
- **Complete all 5 levels** - Earn exclusive NFT badge

## 🏆 Features

### ✅ Implemented
- **Multi-level progression** (1-5)
- **Token-based entry fees** (0.1-0.5 STT)
- **Grid-based mine digging** with mouse/touch controls
- **Real-time gem collection** and bomb detection
- **Timer countdown** per level
- **Smart contract integration** for all game logic
- **On-chain leaderboard** with permanent rankings
- **NFT badge rewards** for completion
- **Wallet connection** via RainbowKit
- **Sound effects** with toggle
- **Responsive design** for all devices
- **No Framer Motion** - Pure CSS animations for better performance

### 🎯 Game States
- **Menu** - Connect wallet and view game info
- **Level Select** - Choose level and pay entry fee
- **Playing** - Active mine digging gameplay
- **Level Complete** - Option to continue or cash out
- **Game Over** - Bomb hit or timeout, lose everything
- **All Complete** - Completed all 5 levels, NFT earned
- **Leaderboard** - View on-chain rankings

## 📊 Smart Contract Architecture

### MineEscapeGameFi.sol
```solidity
struct GameSession {
    uint256 currentLevel;
    uint256 gemsCollected;
    bool isActive;
    uint256 totalTokensSpent;
}

struct LeaderboardEntry {
    address player;
    uint256 maxLevel;
    uint256 totalGems;
    uint256 timestamp;
}
```

### Key Features
- **Sequential Level Progression** - Must complete levels in order
- **Token Balance Verification** - Checks STT balance before entry
- **Automatic Gem Conversion** - 10 gems = 1 STT payout
- **Leaderboard Tracking** - Permanent on-chain records
- **NFT Badge Minting** - Soulbound completion certificate

## 🔐 Security Features

- **No Off-Chain Data** - All game state on blockchain
- **Tamper-Proof Scoring** - Smart contract validation
- **Wallet-Based Authentication** - No traditional login
- **Transparent Transactions** - All actions verifiable
- **Decentralized Leaderboard** - Cannot be manipulated

## 🌐 Network Configuration

### Somnia Testnet
- **Chain ID**: 50312
- **RPC URL**: `https://dream-rpc.somnia.network`
- **Explorer**: `https://shannon-explorer.somnia.network`
- **Native Token**: STT
- **Gas Price**: 20 gwei

## 📱 Responsive Design

- **Desktop**: Full grid layout with hover effects
- **Tablet**: Optimized touch controls
- **Mobile**: Touch-friendly mine digging
- **All Devices**: Wallet connection support

## 🎵 Audio System

- **Web Audio API** implementation
- **Sound Effects**: Gem collection, bomb explosion, victory, game over
- **Toggle Control**: Enable/disable sounds
- **No Background Music** - Focus on gameplay sounds

## 🚀 Performance Optimizations

- **No Framer Motion** - Removed for better click responsiveness
- **CSS Transitions** - Smooth hover/active states
- **Optimized Rendering** - Minimal re-renders
- **Efficient State Management** - Zustand for game state
- **Smart Contract Caching** - Wagmi query optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Play Now

Connect your wallet, get some STT tokens, and start mining! 

**Remember**: This is a high-risk, high-reward game. One wrong click and you lose everything. Are you brave enough to dig deep? ⛏️💎

---

Built with ❤️ for the Web3 gaming community on Somnia Testnet