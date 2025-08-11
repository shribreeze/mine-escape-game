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
    "inputs": [{"internalType": "uint256", "name": "gems", "type": "uint256"}],
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

export const GAMEFI_CONTRACT_ADDRESS: Address = '0x9B4bF5712a81C8CA2e0575b3D1e1c9e632a3f777'
export const STT_TOKEN_ADDRESS: Address = '0xD646e62350cbd1dC9c5cB92CF4175115ca0D362a'

// STT Token ABI for approvals and balance checks
export const STT_ABI = [
  {
    "inputs": [],
    "name": "faucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }, {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "account",
      "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
  }
] as const