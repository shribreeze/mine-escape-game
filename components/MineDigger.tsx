"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Diamond, Zap, Hammer } from 'lucide-react'

interface MineDiggerProps {
  level: number
  onGemCollected: () => void
  onBombHit: () => void
  onLevelComplete: () => void
}

interface Cell {
  id: number
  type: 'empty' | 'gem' | 'bomb' | 'rock'
  revealed: boolean
  x: number
  y: number
}

export function MineDigger({ level, onGemCollected, onBombHit, onLevelComplete }: MineDiggerProps) {
  const [grid, setGrid] = useState<Cell[]>([])
  const [gemsFound, setGemsFound] = useState(0)
  const [totalGems, setTotalGems] = useState(0)

  // Level configurations
  const levelConfig = {
    1: { gems: 8, bombs: 2, gridSize: 10 },
    2: { gems: 7, bombs: 3, gridSize: 10 },
    3: { gems: 6, bombs: 4, gridSize: 12 },
    4: { gems: 5, bombs: 5, gridSize: 12 },
    5: { gems: 4, bombs: 6, gridSize: 14 }
  }

  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig[1]

  // Initialize grid
  useEffect(() => {
    const newGrid: Cell[] = []
    const totalCells = config.gridSize * config.gridSize
    
    // Create empty cells
    for (let i = 0; i < totalCells; i++) {
      newGrid.push({
        id: i,
        type: 'rock',
        revealed: false,
        x: i % config.gridSize,
        y: Math.floor(i / config.gridSize)
      })
    }

    // Place gems randomly
    const gemPositions = new Set<number>()
    while (gemPositions.size < config.gems) {
      const pos = Math.floor(Math.random() * totalCells)
      gemPositions.add(pos)
    }
    gemPositions.forEach(pos => {
      newGrid[pos].type = 'gem'
    })

    // Place bombs randomly (not on gems)
    const bombPositions = new Set<number>()
    while (bombPositions.size < config.bombs) {
      const pos = Math.floor(Math.random() * totalCells)
      if (!gemPositions.has(pos)) {
        bombPositions.add(pos)
      }
    }
    bombPositions.forEach(pos => {
      newGrid[pos].type = 'bomb'
    })

    // Rest are empty
    newGrid.forEach(cell => {
      if (cell.type === 'rock' && !gemPositions.has(cell.id) && !bombPositions.has(cell.id)) {
        cell.type = 'empty'
      }
    })

    setGrid(newGrid)
    setGemsFound(0)
    setTotalGems(config.gems)
  }, [level, config.gems, config.bombs, config.gridSize])

  const handleCellClick = (cellId: number) => {
    const cell = grid.find(c => c.id === cellId)
    if (!cell || cell.revealed) return

    const newGrid = [...grid]
    const cellIndex = newGrid.findIndex(c => c.id === cellId)
    newGrid[cellIndex] = { ...newGrid[cellIndex], revealed: true }
    setGrid(newGrid)

    if (cell.type === 'gem') {
      const newGemsFound = gemsFound + 1
      setGemsFound(newGemsFound)
      onGemCollected()
      
      // Check if all gems collected
      if (newGemsFound >= totalGems) {
        setTimeout(() => onLevelComplete(), 500)
      }
    } else if (cell.type === 'bomb') {
      setTimeout(() => onBombHit(), 100)
    }
  }

  const getCellContent = (cell: Cell) => {
    if (!cell.revealed) {
      return <Hammer className="w-4 h-4 text-slate-400" />
    }

    switch (cell.type) {
      case 'gem':
        return <Diamond className="w-5 h-5 text-yellow-400" />
      case 'bomb':
        return <Zap className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getCellStyle = (cell: Cell) => {
    if (!cell.revealed) {
      return 'bg-gradient-to-br from-amber-800 to-amber-900 border-amber-700 hover:from-amber-700 hover:to-amber-800 cursor-pointer'
    }

    switch (cell.type) {
      case 'gem':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 animate-pulse'
      case 'bomb':
        return 'bg-gradient-to-br from-red-500 to-red-700 border-red-400 animate-pulse'
      default:
        return 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-full p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/20">
      <div className="text-center space-y-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-amber-400 mb-2">
            Level {level} Mine
          </h2>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Diamond className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">{gemsFound}/{totalGems} Gems</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-red-400">{config.bombs} Bombs Hidden</span>
            </div>
          </div>
        </div>

        <div 
          className="grid gap-1 mx-auto p-4 bg-black/20 rounded-xl border border-amber-500/30"
          style={{ 
            gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`,
            maxWidth: `${config.gridSize * 40}px`
          }}
        >
          {grid.map((cell) => (
            <div
              key={cell.id}
              onClick={() => handleCellClick(cell.id)}
              onTouchEnd={() => handleCellClick(cell.id)}
              className={`w-8 h-8 border-2 rounded flex items-center justify-center transition-all select-none ${getCellStyle(cell)}`}
              style={{ 
                transform: cell.revealed && cell.type === 'gem' ? 'scale(1.1)' : 'scale(1)',
                pointerEvents: 'auto',
                touchAction: 'manipulation'
              }}
            >
              {getCellContent(cell)}
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Click to dig • Find all gems to complete level • Avoid bombs!
        </div>
      </div>
    </div>
  )
}