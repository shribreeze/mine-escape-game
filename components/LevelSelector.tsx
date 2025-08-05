"use client"

import { motion } from "framer-motion"
import { Play, Coins, Lock, Trophy } from "lucide-react"
import { useGameFi } from "@/hooks/useGameFi"
import { useGameStore } from "@/store/gameStore"

interface LevelSelectorProps {
  onStartLevel: (level: number) => void
  onBack: () => void
}

export function LevelSelector({ onStartLevel, onBack }: LevelSelectorProps) {
  const { startLevel, getLevelCosts, isPending } = useGameFi()
  const { currentLevel } = useGameStore()
  const levelCosts = getLevelCosts()

  const handleStartLevel = async (level: number) => {
    try {
      await startLevel(level)
      onStartLevel(level)
    } catch (error) {
      console.error('Failed to start level:', error)
      alert('Failed to start level. Make sure you have enough STT tokens.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Select Level
          </h1>
          <p className="text-slate-300 text-lg">
            Each level requires an entry fee in STT tokens. Collect gems to earn rewards!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5].map((level, index) => {
            const cost = levelCosts[index]
            const isLocked = level > currentLevel && currentLevel > 0
            const isAvailable = level === 1 || level <= currentLevel + 1

            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-xl border-2 backdrop-blur-md ${
                  isLocked
                    ? 'bg-slate-800/30 border-slate-600/30'
                    : 'bg-white/5 border-purple-500/30 hover:border-purple-400/60'
                } transition-all`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <Lock className="w-12 h-12 text-slate-400" />
                  </div>
                )}

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{level}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">Level {level}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">{cost} STT</span>
                    </div>
                    
                    <div className="text-slate-400">
                      {level === 1 && "Easy • 8 Gems • 2 Bombs"}
                      {level === 2 && "Medium • 7 Gems • 3 Bombs"}
                      {level === 3 && "Hard • 6 Gems • 4 Bombs"}
                      {level === 4 && "Expert • 5 Gems • 5 Bombs"}
                      {level === 5 && "Master • 4 Gems • 6 Bombs"}
                    </div>
                  </div>

                  {isAvailable && !isLocked && (
                    <button
                      onClick={() => handleStartLevel(level)}
                      disabled={isPending}
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      {isPending ? 'Starting...' : 'Start Level'}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="p-6 bg-white/5 rounded-xl border border-yellow-500/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">
              <Trophy className="w-5 h-5 inline mr-2" />
              Tokenomics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-300">Entry Fee</p>
                <p className="text-white font-bold">Level × 1 STT</p>
              </div>
              <div>
                <p className="text-slate-300">Gem Conversion</p>
                <p className="text-white font-bold">10 Gems = 1 STT</p>
              </div>
              <div>
                <p className="text-slate-300">Complete All 5</p>
                <p className="text-white font-bold">Get NFT Badge</p>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            Back to Menu
          </button>
        </motion.div>
      </div>
    </div>
  )
}