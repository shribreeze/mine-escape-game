import { create } from 'zustand'

interface GameState {
  score: number
  gems: number
  timeLeft: number
  playerPosition: { x: number; y: number; z: number }
  gameStarted: boolean
  
  // Actions
  resetGame: () => void
  updateScore: (points: number) => void
  collectGem: () => void
  decrementTime: () => void
  setPlayerPosition: (position: { x: number; y: number; z: number }) => void
  startGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  gems: 0,
  timeLeft: 120, // 2 minutes
  playerPosition: { x: 0, y: 0, z: 0 },
  gameStarted: false,

  resetGame: () => set({
    score: 0,
    gems: 0,
    timeLeft: 120,
    playerPosition: { x: 0, y: 0, z: 0 },
    gameStarted: false
  }),

  updateScore: (points: number) => set((state) => ({
    score: state.score + points
  })),

  collectGem: () => set((state) => ({
    gems: state.gems + 1
  })),

  decrementTime: () => set((state) => ({
    timeLeft: Math.max(0, state.timeLeft - 1)
  })),

  setPlayerPosition: (position: { x: number; y: number; z: number }) => set({
    playerPosition: position
  }),

  startGame: () => set({
    gameStarted: true
  })
}))