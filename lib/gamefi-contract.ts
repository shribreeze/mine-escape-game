import { Address } from 'viem'

export const GAMEFI_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "level", "type": "uint256"}],
    "name": "startLevel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "gems", "type": "uint256"}],
    "name": "completeLevel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "failGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exitGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "player", "type": "address"}],
    "name": "getGameSession",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "currentLevel", "type": "uint256"},
          {"internalType": "uint256", "name": "gemsCollected", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "uint256", "name": "totalTokensSpent", "type": "uint256"}
        ],
        "internalType": "struct MineEscapeGameFi.GameSession",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "level", "type": "uint256"}],
    "name": "getLevelCost",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLeaderboard",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "player", "type": "address"},
          {"internalType": "uint256", "name": "maxLevel", "type": "uint256"},
          {"internalType": "uint256", "name": "totalGems", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "internalType": "struct MineEscapeGameFi.LeaderboardEntry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const GAMEFI_CONTRACT_ADDRESS: Address = '0x3d9b10A4AF4f055Bcc112528d77e6f80d490973f' // Update with deployed GameFi address
export const STT_TOKEN_ADDRESS: Address = '0x0581BA6e11Ac0AEE20ED0608F4881F5c847cd16A' // Update with deployed STT address