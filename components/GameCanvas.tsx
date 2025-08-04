"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Diamond, AlertTriangle, Crown } from 'lucide-react'

interface GameCanvasProps {
  onGemCollected: () => void
  onTrapTriggered: () => void
  onVictory: () => void
  playerPosition: { x: number; y: number; z: number }
}

export function GameCanvas({ onGemCollected, onTrapTriggered, onVictory }: GameCanvasProps) {
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 5 })
  const [gems, setGems] = useState([
    { x: 2, y: 3, collected: false },
    { x: 8, y: 7, collected: false },
    { x: 4, y: 8, collected: false },
    { x: 9, y: 2, collected: false },
    { x: 1, y: 6, collected: false }
  ])
  const [traps] = useState([
    { x: 3, y: 5 },
    { x: 6, y: 4 },
    { x: 7, y: 8 },
    { x: 2, y: 7 }
  ])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const speed = 1
      let newX = playerPos.x
      let newY = playerPos.y
      
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newY = Math.max(0, newY - speed)
          break
        case 's':
        case 'arrowdown':
          newY = Math.min(9, newY + speed)
          break
        case 'a':
        case 'arrowleft':
          newX = Math.max(0, newX - speed)
          break
        case 'd':
        case 'arrowright':
          newX = Math.min(9, newX + speed)
          break
      }
      
      setPlayerPos({ x: newX, y: newY })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerPos])

  // Handle mouse/touch movement
  const handleCellClick = (x: number, y: number) => {
    // Move player to adjacent cell only
    const dx = Math.abs(x - playerPos.x)
    const dy = Math.abs(y - playerPos.y)
    
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      setPlayerPos({ x, y })
    }
  }

  // Check collisions
  useEffect(() => {
    // Check gem collection
    gems.forEach((gem, index) => {
      if (!gem.collected && playerPos.x === gem.x && playerPos.y === gem.y) {
        setGems(prev => prev.map((g, i) => i === index ? { ...g, collected: true } : g))
        onGemCollected()
      }
    })

    // Check trap collision
    traps.forEach(trap => {
      if (playerPos.x === trap.x && playerPos.y === trap.y) {
        onTrapTriggered()
      }
    })

    // Check victory condition
    if (gems.every(gem => gem.collected)) {
      setTimeout(() => onVictory(), 500)
    }
  }, [playerPos, gems, traps, onGemCollected, onTrapTriggered, onVictory])

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="relative">
        {/* Mine Grid */}
        <div className="grid grid-cols-10 gap-1 p-4 bg-black/30 rounded-xl border border-cyan-500/30">
          {Array.from({ length: 100 }, (_, i) => {
            const x = i % 10
            const y = Math.floor(i / 10)
            const isPlayer = playerPos.x === x && playerPos.y === y
            const gem = gems.find(g => g.x === x && g.y === y && !g.collected)
            const trap = traps.find(t => t.x === x && t.y === y)
            
            return (
              <motion.div
                key={i}
                onClick={() => handleCellClick(x, y)}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center relative cursor-pointer ${
                  isPlayer 
                    ? 'bg-cyan-500 border-cyan-300 shadow-lg shadow-cyan-500/50' 
                    : gem 
                    ? 'bg-yellow-500/20 border-yellow-400/50 hover:bg-yellow-500/30'
                    : trap
                    ? 'bg-red-500/20 border-red-400/50 hover:bg-red-500/30'
                    : 'bg-slate-700/50 border-slate-600/30 hover:bg-slate-600/50'
                }`}
                animate={isPlayer ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isPlayer ? Infinity : 0 }}
                whileHover={{ scale: isPlayer ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlayer && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  </motion.div>
                )}
                
                {gem && (
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <Diamond className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                )}
                
                {trap && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
        
        {/* Victory Portal */}
        {gems.every(gem => gem.collected) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}