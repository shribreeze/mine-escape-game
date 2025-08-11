"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Crown, ArrowLeft, ExternalLink } from "lucide-react"
import { useGameFi } from "@/hooks/useGameFi"
import { useReadContract } from 'wagmi'
import { GAMEFI_ABI, GAMEFI_CONTRACT_ADDRESS } from '@/lib/gamefi-contract'

interface OnChainLeaderboardProps {
  onBack: () => void
}

export function OnChainLeaderboard({ onBack }: OnChainLeaderboardProps) {
  // Read leaderboard from contract with auto-refresh
  const { data: leaderboardData, isLoading, refetch } = useReadContract({
    address: GAMEFI_CONTRACT_ADDRESS,
    abi: GAMEFI_ABI,
    functionName: 'getLeaderboard',
    query: {
      refetchInterval: 5000, // Refresh every 5 seconds
    }
  })
  
  // Manual refresh function
  const handleRefresh = () => {
    refetch()
  }

  const leaderboard = leaderboardData || []

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Trophy className="w-6 h-6 text-slate-400" />
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
            🏆 On-Chain Leaderboard
          </h1>
          <p className="text-slate-300 text-lg">
            Top miners ranked by level reached and gems collected
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Loading leaderboard from blockchain...</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 mb-2">No Scores Yet</h3>
            <p className="text-slate-500">Be the first to complete a level and claim your spot!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {leaderboard.map((entry: any, index: number) => (
              <motion.div
                key={`${entry.player}-${entry.timestamp}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border-2 backdrop-blur-md transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/50'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-400/50'
                    : index === 2
                    ? 'bg-gradient-to-r from-amber-600/10 to-yellow-600/10 border-amber-500/50'
                    : 'bg-white/5 border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-slate-300">#{index + 1}</span>
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-lg text-white">
                          {formatAddress(entry.player)}
                        </span>
                        <a
                          href={`https://shannon-explorer.somnia.network/address/${entry.player}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Played on {formatTimestamp(entry.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">
                          Level {Number(entry.maxLevel)}
                        </p>
                        <p className="text-xs text-slate-400">Max Level</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">
                          {Number(entry.totalGems)}
                        </p>
                        <p className="text-xs text-slate-400">Total Gems</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="p-6 bg-white/5 rounded-xl border border-cyan-500/20 mb-8">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">
              How Rankings Work
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-300">Primary Ranking</p>
                <p className="text-white font-bold">Highest Level Reached</p>
              </div>
              <div>
                <p className="text-slate-300">Tiebreaker</p>
                <p className="text-white font-bold">Total Gems Collected</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              🔄 Refresh
            </button>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Back to Game
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}