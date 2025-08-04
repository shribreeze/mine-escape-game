# Mine & Escape - Web3 Gaming Experience

A fully responsive, modern, and animated Web3 mini-game built with Next.js, Tailwind CSS, Framer Motion, and integrated with Wagmi + RainbowKit for wallet connection.

## 🎮 Game Overview

Mine & Escape is a solo Web3 mini-game where players enter a 3D underground mine to collect treasures and escape before time runs out or traps get triggered.

### Game Flow
1. Connect your wallet via RainbowKit/Wagmi
2. Start the game with animated background transitions
3. Navigate through the mine using WASD or arrow keys
4. Collect glowing gems while avoiding traps
5. Escape before time runs out to win
6. Submit your score to the on-chain leaderboard

## 🛠 Tech Stack

- **Frontend**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS + Tailwind Animate
- **Animations**: Framer Motion
- **3D Graphics**: Three.js (via @react-three/fiber and drei)
- **Web3**: Wagmi v2 + RainbowKit + Viem
- **State Management**: Zustand
- **Smart Contract**: Solidity (Leaderboard contract)

## 🚀 Features

### UI Components
- ✅ Animated start screen with logo and start button
- ✅ Game HUD showing timer, score, and gems collected
- ✅ 3D mine environment (currently 2D grid placeholder)
- ✅ Game over and victory screens with transitions
- ✅ On-chain leaderboard with wallet addresses and scores
- ✅ Real wallet connection using RainbowKit
- ✅ Responsive design with motion effects

### Game Mechanics
- ✅ Player movement with WASD/Arrow keys
- ✅ Gem collection system
- ✅ Trap detection and game over
- ✅ Timer countdown
- ✅ Score calculation with time bonus
- ✅ Victory condition (collect all gems)

### Web3 Integration
- ✅ Real wallet connection (MetaMask, WalletConnect, etc.)
- ✅ Smart contract for leaderboard
- ✅ On-chain score submission
- ✅ Multi-chain support (Mainnet, Polygon, Sepolia)

### Sound System
- ✅ Web Audio API implementation
- ✅ Sound effects for: gem collection, traps, game over, victory
- ✅ Sound toggle functionality

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mine-escape-game
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

4. **Deploy the smart contract** (Optional)
- Deploy `contracts/MineEscapeLeaderboard.sol` to your preferred network
- Update contract addresses in `lib/contract.ts`

5. **Run the development server**
```bash
pnpm dev
```

## 🎯 Game Controls

- **WASD** or **Arrow Keys**: Move player
- **Mouse**: Click to interact with UI elements
- **Space**: (Future: Jump/Special action)

## 🏆 Scoring System

- **Gem Collection**: 100 points per gem
- **Time Bonus**: 10 points per second remaining
- **Victory Bonus**: Additional points for completing the level

## 🔧 Configuration

### Wallet Setup
The game uses RainbowKit for wallet connections. Supported wallets include:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- And many more...

### Smart Contract
The leaderboard smart contract is located in `contracts/MineEscapeLeaderboard.sol`. Key features:
- Stores player scores on-chain
- Maintains top 100 scores
- Prevents score manipulation
- Emits events for score submissions

### Supported Networks
- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base
- Sepolia (Testnet)

## 🎨 Customization

### Adding New Sound Effects
Edit `hooks/useSound.ts` to add new sound types and frequencies.

### Modifying Game Mechanics
Update `store/gameStore.ts` for game state management and `components/GameCanvas.tsx` for game logic.

### Styling Changes
All styles use Tailwind CSS. Modify classes directly in components or extend the theme in `tailwind.config.ts`.

## 🚧 Future Enhancements

- [ ] Full 3D mine environment with Three.js
- [ ] Multiple levels with increasing difficulty
- [ ] NFT rewards for high scores
- [ ] Multiplayer mode
- [ ] Mobile touch controls
- [ ] Background music integration
- [ ] Power-ups and special items
- [ ] Achievement system

## 📝 Smart Contract Deployment

To deploy the leaderboard contract:

1. Install Hardhat or Foundry
2. Configure your network settings
3. Deploy `MineEscapeLeaderboard.sol`
4. Update contract addresses in `lib/contract.ts`
5. Verify the contract on Etherscan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎮 Play Now

Visit the deployed game at: [Your deployment URL]

---

Built with ❤️ for the Web3 gaming community