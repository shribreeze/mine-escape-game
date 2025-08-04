"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Hammer,
  Diamond,
  Zap,
  Crown,
  TrendingUp,
  Users,
  Wallet,
  Menu,
  X,
  RotateCcw,
  Trophy,
  Info,
  Gift,
} from "lucide-react"

export default function MineEscapeGame() {
  const [gameState, setGameState] = useState<"playing" | "gameOver" | "escaped" | "idle">("idle")
  const [depth, setDepth] = useState(0)
  const [gems, setGems] = useState(0)
  const [riskPercent, setRiskPercent] = useState(0)
  const [lastItem, setLastItem] = useState<string>("")
  const [discoveredItems, setDiscoveredItems] = useState<Array<{ type: string; icon: any; count: number }>>([])
  const [showModal, setShowModal] = useState(false)
  const [showBottomDrawer, setShowBottomDrawer] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const dig = () => {
    if (gameState !== "playing" && gameState !== "idle") return

    setGameState("playing")
    const newDepth = Math.min(depth + Math.random() * 10, 100)
    setDepth(newDepth)

    // Simulate finding items
    const items = ["gem", "bomb", "artifact"]
    const foundItem = items[Math.floor(Math.random() * items.length)]

    if (foundItem === "gem") {
      setGems((prev) => prev + 1)
      setLastItem("Rare Gem")
    } else if (foundItem === "bomb") {
      setLastItem("Dangerous Bomb")
      setRiskPercent((prev) => Math.min(prev + 15, 100))
    } else {
      setLastItem("Ancient Artifact")
    }

    // Update discovered items
    setDiscoveredItems((prev) => {
      const existing = prev.find((item) => item.type === foundItem)
      if (existing) {
        return prev.map((item) => (item.type === foundItem ? { ...item, count: item.count + 1 } : item))
      } else {
        const iconMap = { gem: Diamond, bomb: Zap, artifact: Crown }
        return [...prev, { type: foundItem, icon: iconMap[foundItem as keyof typeof iconMap], count: 1 }]
      }
    })

    // Check game over conditions
    if (riskPercent >= 85 && Math.random() > 0.7) {
      setGameState("gameOver")
      setShowModal(true)
    } else if (newDepth >= 100) {
      setGameState("escaped")
      setShowModal(true)
    }
  }

  const cashOut = () => {
    if (depth < 20) return
    setGameState("escaped")
    setShowModal(true)
  }

  const restart = () => {
    setGameState("idle")
    setDepth(0)
    setGems(0)
    setRiskPercent(0)
    setLastItem("")
    setDiscoveredItems([])
    setShowModal(false)
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 transition-all"
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Leaderboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWalletConnected(!isWalletConnected)}
              className={`px-4 py-2 rounded-lg backdrop-blur-sm border transition-all ${
                isWalletConnected
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-400/30 hover:border-green-400/60"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-400/30 hover:border-cyan-400/60"
              }`}
            >
              <Wallet className="w-4 h-4 inline mr-2" />
              {isWalletConnected ? "Connected" : "Connect Wallet"}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-100px)]">
        {/* Left Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Depth Meter */}
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-purple-500/20 p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4">Depth Meter</h3>
            <div className="relative h-48 w-8 mx-auto bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
              <motion.div
                className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full"
                initial={{ height: 0 }}
                animate={{ height: `${depth}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/20 to-transparent animate-pulse" />
            </div>
            <p className="text-center mt-2 text-sm text-cyan-300">{depth.toFixed(1)}m</p>
          </div>

          {/* Discovered Items */}
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-purple-500/20 p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4">Discovered</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {discoveredItems.map((item, index) => (
                  <motion.div
                    key={item.type}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 border border-purple-400/20"
                  >
                    <item.icon className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm flex-1 capitalize">{item.type}</span>
                    <span className="text-xs text-cyan-300">{item.count}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Main Game Area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 flex flex-col items-center justify-center space-y-8"
        >
          {/* Three.js Placeholder */}
          <div className="w-full max-w-2xl h-64 bg-gradient-to-br from-slate-800/50 to-purple-900/50 rounded-xl border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
                <Diamond className="w-8 h-8 text-white" />
              </div>
              <p className="text-cyan-300">3D Mine Visualization</p>
              <p className="text-xs text-slate-400 mt-1">Three.js Canvas Placeholder</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-cyan-300">Depth Progress</span>
              <span className="text-purple-300">{depth.toFixed(1)}% Complete</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${depth}%` }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-6">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={dig}
              disabled={gameState === "gameOver" || gameState === "escaped"}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/25 border border-cyan-400/30 hover:border-cyan-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Hammer className="w-6 h-6 inline mr-2" />
              DIG
            </motion.button>

            <motion.button
              whileHover={{
                scale: depth >= 20 ? 1.05 : 1,
                boxShadow: depth >= 20 ? "0 0 30px rgba(34, 197, 94, 0.5)" : "none",
              }}
              whileTap={{ scale: depth >= 20 ? 0.95 : 1 }}
              onClick={cashOut}
              disabled={depth < 20}
              className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg border transition-all ${
                depth >= 20
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/25 border-green-400/30 hover:border-green-400/60"
                  : "bg-slate-700 shadow-slate-700/25 border-slate-600/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <TrendingUp className="w-6 h-6 inline mr-2" />
              CASH OUT
            </motion.button>
          </div>

          {/* Last Item Found */}
          <AnimatePresence>
            {lastItem && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="backdrop-blur-md bg-white/10 rounded-lg px-4 py-2 border border-yellow-400/30"
              >
                <p className="text-yellow-300 text-sm">Last found: {lastItem}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Player Stats */}
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-purple-500/20 p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4">Player Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Gems</span>
                <span className="text-yellow-400 font-bold">{gems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Risk %</span>
                <span
                  className={`font-bold ${riskPercent > 70 ? "text-red-400" : riskPercent > 40 ? "text-yellow-400" : "text-green-400"}`}
                >
                  {riskPercent.toFixed(1)}%
                </span>
              </div>
              <div className="pt-2 border-t border-purple-500/20">
                <p className="text-xs text-slate-400">Last Item</p>
                <p className="text-sm text-cyan-300">{lastItem || "None"}</p>
              </div>
            </div>
          </div>

          {/* Mini Leaderboard */}
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-purple-500/20 p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4">Top Miners</h3>
            <div className="space-y-2">
              {[
                { name: "CryptoMiner", score: 1250 },
                { name: "DiamondHands", score: 980 },
                { name: "DeepDigger", score: 750 },
              ].map((player, index) => (
                <div key={player.name} className="flex items-center space-x-2 text-xs">
                  <span className="text-yellow-400">#{index + 1}</span>
                  <span className="flex-1 text-slate-300">{player.name}</span>
                  <span className="text-cyan-300">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Drawer Toggle */}
      <motion.button
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowBottomDrawer(!showBottomDrawer)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 backdrop-blur-md bg-white/10 rounded-full border border-purple-500/30 hover:border-purple-500/60 transition-all"
      >
        <Menu className="w-4 h-4" />
      </motion.button>

      {/* Bottom Drawer */}
      <AnimatePresence>
        {showBottomDrawer && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-black/80 border-t border-purple-500/30 p-6 z-40"
          >
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-cyan-400">Game Info</h3>
                <button
                  onClick={() => setShowBottomDrawer(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                  <Info className="w-6 h-6 text-cyan-400 mb-2" />
                  <h4 className="font-semibold mb-2">Game Rules</h4>
                  <p className="text-sm text-slate-300">
                    Dig deep to find treasures, but beware of bombs that increase your risk!
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                  <Users className="w-6 h-6 text-purple-400 mb-2" />
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-sm text-slate-300">A Web3 mining game where strategy meets luck in the depths.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                  <Gift className="w-6 h-6 text-yellow-400 mb-2" />
                  <h4 className="font-semibold mb-2">Rewards</h4>
                  <p className="text-sm text-slate-300">Earn NFT treasures and tokens based on your mining success!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="backdrop-blur-md bg-white/10 rounded-2xl border border-purple-500/30 p-8 max-w-md w-full text-center"
            >
              <div className="mb-6">
                {gameState === "gameOver" ? (
                  <>
                    <Zap className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over!</h2>
                    <p className="text-slate-300">You hit a bomb and lost everything!</p>
                  </>
                ) : (
                  <>
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-400 mb-2">Escape Successful!</h2>
                    <p className="text-slate-300">You made it out with {gems} gems!</p>
                  </>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restart}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold shadow-lg shadow-cyan-500/25 border border-cyan-400/30 hover:border-cyan-400/60 transition-all"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
