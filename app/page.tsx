"use client"

import { useState, useEffect } from "react"
import {
  Hammer,
  Diamond,
  Zap,
  Crown,
  Trophy,
  Play,
  Clock,
  Coins,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
  ArrowLeft
} from "lucide-react"
import { MineDigger } from "@/components/MineDigger"
import { WalletConnect } from "@/components/WalletConnect"
import { LevelSelector } from "@/components/LevelSelector"
import { OnChainLeaderboard } from "@/components/OnChainLeaderboard"
import { useGameStore } from "@/store/gameStore"
import { useSound } from "@/hooks/useSound"
import { useAccount } from 'wagmi'
import { useGameFi } from '@/hooks/useGameFi'

type GameState = "menu" | "levelSelect" | "playing" | "levelComplete" | "gameOver" | "allComplete" | "leaderboard"

export default function MineEscapeGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { address, isConnected } = useAccount()
  const { gameSession, startLevel, completeLevel, failGame, exitGame, isPending, isConfirmed, refetchSession } = useGameFi()
  
  // Debug: Log game session changes
  useEffect(() => {
    console.log('Game session updated:', gameSession)
  }, [gameSession])
  
  useEffect(() => {
    if (isConfirmed) {
      console.log('Transaction confirmed!')
    }
  }, [isConfirmed])
  
  const {
    currentLevel,
    gems,
    timeLeft,
    totalGemsCollected,
    hasActiveBomb,
    resetGame,
    startLevel: startGameLevel,
    triggerBomb,
    completeLevel: completeGameLevel
  } = useGameStore()

  const { playSound } = useSound(soundEnabled)

  useEffect(() => {
    if (hasActiveBomb && gameState === 'playing') {
      setGameState('gameOver')
      playSound('trap')
      failGame()
    }
  }, [hasActiveBomb, gameState, playSound, failGame])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        useGameStore.getState().decrementTime()
        if (timeLeft <= 1) {
          setGameState("gameOver")
          playSound("gameOver")
          failGame()
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, timeLeft, playSound, failGame])

  const handleStartLevel = async (level: number) => {
    try {
      // This is called from LevelSelector after approval and startLevel contract call
      startGameLevel(level)
      setGameState("playing")
      playSound("start")
    } catch (error) {
      alert('Failed to start level. Check your STT balance.')
    }
  }

  const handleLevelComplete = async () => {
    try {
      await completeLevel(gems)
      completeGameLevel()
      if (currentLevel === 5) {
        setGameState("allComplete")
        playSound("victory")
      } else {
        setGameState("levelComplete")
        playSound("victory")
      }
    } catch (error) {
      console.error('Failed to complete level:', error)
    }
  }

  const handleExitGame = async () => {
    try {
      console.log('Exiting game with gems:', gems)
      console.log('Current level:', currentLevel)
      console.log('Game session before exit:', gameSession)
      
      if (gems === 0) {
        alert('No gems to cash out!')
        resetGame()
        setGameState("menu")
        return
      }
      
      // Refetch session before exit
      await refetchSession()
      console.log('Game session after refetch:', gameSession)
      
      await exitGame(gems)
      
      const sttEarned = (gems / 10).toFixed(1)
      alert(`Success! You earned ${sttEarned} STT from ${gems} gems!`)
      
      // Refresh balances after transaction
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
      resetGame()
      setGameState("menu")
    } catch (error) {
      console.error('Failed to exit game:', error)
      alert('Failed to cash out. Please try again.')
    }
  }

  const handleGemCollected = () => {
    useGameStore.getState().collectGem()
    playSound("gemCollect")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hammer className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Mine & Escape
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg backdrop-blur-sm border border-slate-400/30 cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setGameState("leaderboard")}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 hover:scale-105 active:scale-95 transition-all cursor-pointer touch-manipulation"
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Leaderboard
            </button>

            <WalletConnect 
              isConnected={isConnected}
              onConnect={() => {}}
              onDisconnect={() => {}}
            />
          </div>
        </div>
      </nav>

      <div>
        {gameState === "leaderboard" && (
          <OnChainLeaderboard onBack={() => setGameState("menu")} />
        )}

        {gameState === "menu" && (
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
            <div className="text-center space-y-8 max-w-2xl">
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Diamond className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mine & Escape
                </h1>
                
                <p className="text-xl text-slate-300 max-w-lg mx-auto">
                  Dig deep, collect gems, avoid bombs. Pay STT to play, earn rewards!
                </p>
              </div>

              <div className="space-y-6">
                {!isConnected ? (
                  <div className="p-6 bg-red-500/10 border border-red-400/30 rounded-xl">
                    <p className="text-red-400 font-medium mb-4">Connect your wallet to start playing</p>
                    <WalletConnect 
                      isConnected={isConnected}
                      onConnect={() => {}}
                      onDisconnect={() => {}}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setGameState("levelSelect")}
                    className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-xl font-bold hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Play className="w-6 h-6 inline mr-3" />
                    Start Mining
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-bold">Pay STT to Play</p>
                    <p className="text-slate-400">Level 1: 0.1 STT, Level 2: 0.2 STT...</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <Diamond className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-white font-bold">Collect Gems</p>
                    <p className="text-slate-400">10 gems = 1 STT reward</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <Zap className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <p className="text-white font-bold">Avoid Bombs</p>
                    <p className="text-slate-400">Hit bomb = lose everything</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === "levelSelect" && (
          <LevelSelector 
            onStartLevel={handleStartLevel}
            onBack={() => setGameState("menu")}
          />
        )}

        {gameState === "playing" && (
          <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-white">Level {currentLevel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-xl font-bold text-yellow-400">{timeLeft}s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Diamond className="w-5 h-5 text-cyan-400" />
                  <span className="text-xl font-bold text-cyan-400">{gems}</span>
                </div>
              </div>
              
              <button
                onClick={handleExitGame}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg text-sm cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
              >
                Exit & Cash Out
              </button>
            </div>

            <div className="flex-1">
              <MineDigger
                level={currentLevel}
                onGemCollected={handleGemCollected}
                onBombHit={() => triggerBomb()}
                onLevelComplete={handleLevelComplete}
              />
            </div>

            <div className="p-4 bg-black/20 backdrop-blur-sm border-t border-purple-500/20">
              <div className="text-sm text-slate-400 text-center">
                Click to dig • Find gems • Avoid bombs
              </div>
            </div>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
            <div className="text-center space-y-8 max-w-md">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-red-400">Game Over!</h2>
                <p className="text-slate-300">You hit a bomb or ran out of time!</p>
                <p className="text-red-400 font-bold">All tokens and gems lost!</p>
                
                <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-red-500/20">
                  <div className="flex justify-between">
                    <span>Level Reached:</span>
                    <span className="font-bold text-purple-400">{currentLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gems Lost:</span>
                    <span className="font-bold text-red-400">{gems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT Lost:</span>
                    <span className="font-bold text-red-400">{(currentLevel * 0.1).toFixed(1)} STT</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    resetGame()
                    setGameState("levelSelect")
                  }}
                  className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Start Over (Level 1)
                </button>
                
                <button
                  onClick={() => setGameState("menu")}
                  className="w-full px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg font-bold cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 inline mr-2" />
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === "levelComplete" && (
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
            <div className="text-center space-y-8 max-w-md">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-green-400">Level {currentLevel} Complete!</h2>
                <div className="p-4 bg-white/5 rounded-lg border border-green-500/20">
                  <div className="flex justify-between mb-2">
                    <span>Gems Collected:</span>
                    <span className="font-bold text-cyan-400">{gems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT Earned:</span>
                    <span className="font-bold text-yellow-400">{Math.floor(gems / 10)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {currentLevel < 5 && (
                  <button
                    onClick={() => setGameState("levelSelect")}
                    className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform"
                  >
                    Next Level ({((currentLevel + 1) * 0.1).toFixed(1)} STT)
                  </button>
                )}
                
                <button
                  onClick={handleExitGame}
                  className="w-full px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform"
                >
                  Cash Out & Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === "allComplete" && (
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
            <div className="text-center space-y-8 max-w-md">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Crown className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-yellow-400">Master Miner!</h2>
                <p className="text-slate-300">You completed all 5 levels!</p>
                <p className="text-yellow-400 font-bold">🏆 NFT Badge Earned!</p>
                
                <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-yellow-500/20">
                  <div className="flex justify-between">
                    <span>Total Gems:</span>
                    <span className="font-bold text-cyan-400">{totalGemsCollected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STT Earned:</span>
                    <span className="font-bold text-yellow-400">{Math.floor(totalGemsCollected / 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NFT Badge:</span>
                    <span className="font-bold text-purple-400">✅ Minted</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    resetGame()
                    setGameState("levelSelect")
                  }}
                  className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Play Again
                </button>
                
                <button
                  onClick={() => setGameState("leaderboard")}
                  className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
                >
                  <Trophy className="w-5 h-5 inline mr-2" />
                  View Leaderboard
                </button>
                
                <button
                  onClick={() => setGameState("menu")}
                  className="w-full px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg font-bold cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 inline mr-2" />
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}