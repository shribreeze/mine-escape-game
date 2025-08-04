"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Hammer,
  Diamond,
  Zap,
  Crown,
  Trophy,
  Wallet,
  Play,
  RotateCcw,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX
} from "lucide-react"
import { GameCanvas } from "@/components/GameCanvas"
import { WalletConnect } from "@/components/WalletConnect"
import { Leaderboard } from "@/components/Leaderboard"
import { useGameStore } from "@/store/gameStore"
import { useSound } from "@/hooks/useSound"
import { useAccount } from 'wagmi'
import { useLeaderboard } from '@/hooks/useLeaderboard'

type GameState = "start" | "playing" | "gameOver" | "victory" | "leaderboard"

export default function MineEscapeGame() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const { address, isConnected } = useAccount()
  const { submitScore, isSubmitting, isConfirmed } = useLeaderboard()
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  const {
    score,
    gems,
    timeLeft,
    playerPosition,
    resetGame,
    updateScore,
    collectGem,
    decrementTime
  } = useGameStore()

  const { playSound } = useSound(soundEnabled)

  // Global keyboard navigation
  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (gameState === 'playing') {
          restartGame()
        } else if (gameState === 'leaderboard') {
          setGameState('start')
        }
      }
      if (event.key === 'Enter' || event.key === ' ') {
        if (gameState === 'start') {
          startGame()
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyPress)
    return () => window.removeEventListener('keydown', handleGlobalKeyPress)
  }, [gameState])

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        decrementTime()
        if (timeLeft <= 1) {
          setGameState("gameOver")
          playSound("gameOver")
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, timeLeft, decrementTime, playSound])

  const startGame = () => {
    resetGame()
    setGameState("playing")
    playSound("start")
  }

  const handleGameOver = () => {
    setGameState("gameOver")
    playSound("gameOver")
  }

  const handleVictory = () => {
    setGameState("victory")
    playSound("victory")
  }

  const handleGemCollected = () => {
    collectGem()
    updateScore(100)
    playSound("gemCollect")
  }

  const handleTrapTriggered = () => {
    handleGameOver()
    playSound("trap")
  }

  const restartGame = () => {
    resetGame()
    setGameState("start")
  }

  const showLeaderboard = () => {
    setGameState("leaderboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      </div>

      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-purple-500/20"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <Hammer className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Mine & Escape
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg backdrop-blur-sm border border-slate-400/30 cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={showLeaderboard}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 hover:scale-105 active:scale-95 transition-all cursor-pointer touch-manipulation"
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Leaderboard
            </button>

            <WalletConnect 
              isConnected={isConnected}
              onConnect={() => setIsWalletConnected(true)}
              onDisconnect={() => setIsWalletConnected(false)}
            />
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {/* Start Screen */}
        {gameState === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4"
          >
            <div className="text-center space-y-8 max-w-2xl">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                  >
                    <Diamond className="w-16 h-16 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-full"
                  />
                </div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  Mine & Escape
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-slate-300 max-w-lg mx-auto"
                >
                  Enter the underground mine, collect treasures, avoid traps, and escape before time runs out!
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <button
                  onClick={startGame}
                  className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-xl font-bold shadow-lg hover:shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer touch-manipulation"
                >
                  <Play className="w-6 h-6 inline mr-3" />
                  Start Game
                </button>
                
                <p className="text-xs text-slate-500 mt-2">Press Enter or Space to start</p>

                <div className="flex justify-center space-x-8 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Diamond className="w-4 h-4 text-cyan-400" />
                    <span>Collect Gems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Avoid Traps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>Beat the Clock</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Game Playing Screen */}
        {gameState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[calc(100vh-100px)]"
          >
            {/* Game HUD */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm border-b border-purple-500/20"
            >
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-xl font-bold text-yellow-400">{timeLeft}s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Diamond className="w-5 h-5 text-cyan-400" />
                  <span className="text-xl font-bold text-cyan-400">{gems}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-xl font-bold text-purple-400">{score}</span>
                </div>
              </div>
              
              <button
                onClick={restartGame}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg text-sm cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Restart
              </button>
            </motion.div>

            {/* 3D Game Canvas */}
            <div className="flex-1">
              <GameCanvas
                onGemCollected={handleGemCollected}
                onTrapTriggered={handleTrapTriggered}
                onVictory={handleVictory}
                playerPosition={playerPosition}
              />
            </div>

            {/* Controls Info */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-black/20 backdrop-blur-sm border-t border-purple-500/20"
            >
              <div className="flex justify-center space-x-4 text-xs md:text-sm text-slate-400 flex-wrap">
                <span>WASD/Arrow Keys</span>
                <span>•</span>
                <span>Click/Touch Adjacent Cells</span>
                <span>•</span>
                <span>ESC to Restart</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameOver" && (
          <motion.div
            key="gameOver"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="text-center space-y-8 max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="w-12 h-12 text-white" />
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-red-400">Game Over!</h2>
                <p className="text-slate-300">You triggered a trap or ran out of time!</p>
                
                <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-red-500/20">
                  <div className="flex justify-between">
                    <span>Final Score:</span>
                    <span className="font-bold text-purple-400">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gems Collected:</span>
                    <span className="font-bold text-cyan-400">{gems}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={startGame}
                  className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Try Again
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showLeaderboard}
                  className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold cursor-pointer touch-manipulation"
                >
                  <Trophy className="w-5 h-5 inline mr-2" />
                  View Leaderboard
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Victory Screen */}
        {gameState === "victory" && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="text-center space-y-8 max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
                >
                  <Crown className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full"
                />
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-yellow-400">Victory!</h2>
                <p className="text-slate-300">You successfully escaped the mine!</p>
                
                <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-yellow-500/20">
                  <div className="flex justify-between">
                    <span>Final Score:</span>
                    <span className="font-bold text-purple-400">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gems Collected:</span>
                    <span className="font-bold text-cyan-400">{gems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Bonus:</span>
                    <span className="font-bold text-yellow-400">{timeLeft * 10}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {isConnected && address && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      try {
                        await submitScore(score + (timeLeft * 10), gems)
                      } catch (error) {
                        console.error('Failed to submit score:', error)
                        alert('Failed to submit score. Make sure the contract is deployed on this network.')
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold disabled:opacity-50 cursor-pointer touch-manipulation"
                  >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    {isSubmitting ? 'Submitting...' : isConfirmed ? 'Score Submitted!' : 'Submit to Leaderboard'}
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold cursor-pointer touch-manipulation"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Play Again
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showLeaderboard}
                  className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold"
                >
                  <Trophy className="w-5 h-5 inline mr-2" />
                  View Leaderboard
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Screen */}
        {gameState === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-[calc(100vh-100px)] p-4"
          >
            <Leaderboard onBack={() => setGameState("start")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}