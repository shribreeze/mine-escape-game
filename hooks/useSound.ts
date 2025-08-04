import { useCallback } from 'react'

type SoundType = 'start' | 'gemCollect' | 'trap' | 'gameOver' | 'victory' | 'background'

export function useSound(enabled: boolean) {
  const playSound = useCallback((soundType: SoundType) => {
    if (!enabled) return

    // Create audio context for web audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }

    switch (soundType) {
      case 'start':
        // Ascending chord
        createTone(261.63, 0.2) // C
        setTimeout(() => createTone(329.63, 0.2), 100) // E
        setTimeout(() => createTone(392.00, 0.3), 200) // G
        break
        
      case 'gemCollect':
        // Bright chime
        createTone(523.25, 0.1, 'triangle') // C5
        setTimeout(() => createTone(659.25, 0.1, 'triangle'), 50) // E5
        setTimeout(() => createTone(783.99, 0.2, 'triangle'), 100) // G5
        break
        
      case 'trap':
        // Harsh buzz
        createTone(110, 0.5, 'sawtooth')
        setTimeout(() => createTone(98, 0.3, 'sawtooth'), 100)
        break
        
      case 'gameOver':
        // Descending sad tone
        createTone(392.00, 0.3) // G
        setTimeout(() => createTone(349.23, 0.3), 200) // F
        setTimeout(() => createTone(293.66, 0.5), 400) // D
        break
        
      case 'victory':
        // Victory fanfare
        createTone(523.25, 0.2) // C5
        setTimeout(() => createTone(659.25, 0.2), 150) // E5
        setTimeout(() => createTone(783.99, 0.2), 300) // G5
        setTimeout(() => createTone(1046.50, 0.4), 450) // C6
        break
        
      case 'background':
        // Ambient drone (not implemented for simplicity)
        break
    }
  }, [enabled])

  return { playSound }
}