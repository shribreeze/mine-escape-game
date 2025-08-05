import { create } from 'zustand'

interface GameState {
  currentLevel: number
  gems: number
  timeLeft: number
  playerPosition: { x: number; y: number; z: number }
  gameStarted: boolean
  totalGemsCollected: number
  tokensSpent: number
  hasActiveBomb: boolean
  
  // Actions
  resetGame: () => void
  collectGem: () => void
  decrementTime: () => void
  setPlayerPosition: (position: { x: number; y: number; z: number }) => void
  startLevel: (level: number) => void
  nextLevel: () => void
  triggerBomb: () => void
  completeLevel: () => void
}

const getLevelConfig = (level: number) => {
  const configs = {
    1: { timeLimit: 120, bombCount: 2, gemCount: 8 },
    2: { timeLimit: 100, bombCount: 3, gemCount: 7 },
    3: { timeLimit: 80, bombCount: 4, gemCount: 6 },
    4: { timeLimit: 60, bombCount: 5, gemCount: 5 },
    5: { timeLimit: 45, bombCount: 6, gemCount: 4 }
  }
  return configs[level as keyof typeof configs] || configs[1]
}

export const useGameStore = create<GameState>((set, get) => ({
  currentLevel: 1,
  gems: 0,
  timeLeft: 120,
  playerPosition: { x: 0, y: 0, z: 0 },
  gameStarted: false,
  totalGemsCollected: 0,
  tokensSpent: 0,
  hasActiveBomb: false,

  resetGame: () => {
    const config = getLevelConfig(1)
    set({
      currentLevel: 1,
      gems: 0,
      timeLeft: config.timeLimit,
      playerPosition: { x: 0, y: 0, z: 0 },
      gameStarted: false,
      totalGemsCollected: 0,
      tokensSpent: 0,
      hasActiveBomb: false
    })
  },

  collectGem: () => set((state) => ({
    gems: state.gems + 1,
    totalGemsCollected: state.totalGemsCollected + 1
  })),

  decrementTime: () => set((state) => ({
    timeLeft: Math.max(0, state.timeLeft - 1)
  })),

  setPlayerPosition: (position: { x: number; y: number; z: number }) => set({
    playerPosition: position
  }),

  startLevel: (level: number) => {
    const config = getLevelConfig(level)
    set({
      currentLevel: level,
      gems: 0,
      timeLeft: config.timeLimit,
      playerPosition: { x: 0, y: 0, z: 0 },
      gameStarted: true,
      hasActiveBomb: false,
      tokensSpent: get().tokensSpent + level
    })
  },

  nextLevel: () => {
    const state = get()
    const nextLevel = state.currentLevel + 1
    if (nextLevel <= 5) {
      const config = getLevelConfig(nextLevel)
      set({
        currentLevel: nextLevel,
        gems: 0,
        timeLeft: config.timeLimit,
        playerPosition: { x: 0, y: 0, z: 0 },
        hasActiveBomb: false
      })
    }
  },

  triggerBomb: () => set({
    hasActiveBomb: true,
    gameStarted: false
  }),

  completeLevel: () => set((state) => ({
    gameStarted: false
  }))
}))