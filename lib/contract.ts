import { Address } from 'viem'

// Contract ABI for the MineEscapeLeaderboard
export const LEADERBOARD_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_score",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_gems",
        "type": "uint256"
      }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_count",
        "type": "uint256"
      }
    ],
    "name": "getTopScores",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "score",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "gems",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct MineEscapeLeaderboard.Score[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_player",
        "type": "address"
      }
    ],
    "name": "getPlayerRank",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "score",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gems",
        "type": "uint256"
      }
    ],
    "name": "ScoreSubmitted",
    "type": "event"
  }
] as const

// Contract addresses for different networks
export const CONTRACT_ADDRESSES: Record<number, Address> = {
  2019: '0x0000000000000000000000000000000000000000', // Somnia Mainnet (replace with actual)
  50312: '0xED4e24F3F5EB9ca614a5b76BD3d6C6F4C1eE00bA', // Somnia Testnet
  1: '0x0000000000000000000000000000000000000000', // Mainnet (replace with actual)
  11155111: '0x0000000000000000000000000000000000000000', // Sepolia (replace with actual)
  137: '0x0000000000000000000000000000000000000000', // Polygon (replace with actual)
}