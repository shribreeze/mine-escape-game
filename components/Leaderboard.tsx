"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Crown, ArrowLeft, Star, Loader2 } from "lucide-react"
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useAccount } from 'wagmi'

interface LeaderboardProps {
  onBack: () => void
}

const mockLeaderboard = [
  { rank: 1, address: "0x1234...5678", score: 2850, gems: 15 },
  { rank: 2, address: "0x9876...4321", score: 2640, gems: 12 },
  { rank: 3, address: "0x5555...9999", score: 2420, gems: 11 },
  { rank: 4, address: "0x7777...1111", score: 2180, gems: 10 },
  { rank: 5, address: "0x3333...7777", score: 1950, gems: 9 },
  { rank: 6, address: "0x8888...2222", score: 1720, gems: 8 },
  { rank: 7, address: "0x4444...6666", score: 1580, gems: 7 },
  { rank: 8, address: "0x2222...8888", score: 1340, gems: 6 },
  { rank: 9, address: "0x6666...4444", score: 1120, gems: 5 },
  { rank: 10, address: "0x9999...3333", score: 980, gems: 4 }
]

export function Leaderboard({ onBack }: LeaderboardProps) {
  const { topScores, isLoadingScores } = useLeaderboard()
  const { isConnected } = useAccount()
  
  // Use contract data if available and connected, otherwise show empty state
  const leaderboardData = isConnected && topScores && topScores.length > 0 
    ? topScores.map((score: any, index: number) => ({
        rank: index + 1,
        address: `${score.player.slice(0, 6)}...${score.player.slice(-4)}`,
        score: Number(score.score),
        gems: Number(score.gems)
      }))
    : []
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-400">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-400/30"
      case 2:
        return "from-gray-400/20 to-gray-500/20 border-gray-400/30"
      case 3:
        return "from-amber-500/20 to-amber-600/20 border-amber-400/30"
      default:
        return "from-purple-500/10 to-purple-600/10 border-purple-400/20"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg backdrop-blur-sm border border-slate-400/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-slate-400 mt-2">Top miners who escaped successfully</p>
        </div>

        <div className="w-20" /> {/* Spacer */}
      </motion.div>

      {isLoadingScores ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="ml-3 text-slate-400">Loading leaderboard...</span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30 text-center"
            >
              <p className="text-yellow-400 font-medium">Connect your wallet to view live leaderboard data</p>
              <p className="text-sm text-slate-400 mt-1">Real-time scores from Somnia blockchain</p>
            </motion.div>
          )}
          
          {isConnected && leaderboardData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-xl bg-slate-500/10 border border-slate-400/30 text-center"
            >
              <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-400 font-medium">No scores yet!</p>
              <p className="text-sm text-slate-500 mt-1">Be the first to submit a score to the leaderboard</p>
            </motion.div>
          )}
        {leaderboardData.map((entry, index) => (
          <motion.div
            key={entry.address}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-gradient-to-r ${getRankColor(entry.rank)} border hover:border-opacity-60 transition-all`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
                {getRankIcon(entry.rank)}
              </div>
              
              <div>
                <div className="font-mono text-lg font-semibold text-white">
                  {entry.address}
                </div>
                <div className="text-sm text-slate-400">
                  Rank #{entry.rank}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-right">
              <div>
                <div className="flex items-center space-x-1 text-cyan-400">
                  <Trophy className="w-4 h-4" />
                  <span className="font-bold">{entry.gems}</span>
                </div>
                <div className="text-xs text-slate-400">Gems</div>
              </div>
              
              <div>
                <div className="flex items-center space-x-1 text-purple-400">
                  <Star className="w-4 h-4" />
                  <span className="font-bold text-xl">{entry.score.toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-400">Score</div>
              </div>
            </div>
          </motion.div>
        ))}
        </motion.div>
      )}

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-6 rounded-xl backdrop-blur-md bg-white/5 border border-purple-500/20 text-center"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-2">How to Get on the Leaderboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="flex flex-col items-center space-y-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span>Collect all gems to maximize your score</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Crown className="w-8 h-8 text-purple-400" />
            <span>Escape quickly for time bonus points</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Star className="w-8 h-8 text-cyan-400" />
            <span>Connect wallet to submit your score</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}