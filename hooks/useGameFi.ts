import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { GAMEFI_ABI, GAMEFI_CONTRACT_ADDRESS } from '@/lib/gamefi-contract'
import { useChainId, useAccount } from 'wagmi'
import { parseEther } from 'viem'

export function useGameFi() {
  const chainId = useChainId()
  const { address } = useAccount()
  const { switchChain } = useSwitchChain()

  // Read game session
  const { data: gameSession, refetch: refetchSession } = useReadContract({
    address: GAMEFI_CONTRACT_ADDRESS,
    abi: GAMEFI_ABI,
    functionName: 'getGameSession',
    args: address ? [address] : undefined,
  })

  // Read level costs
  const { data: level1Cost } = useReadContract({
    address: GAMEFI_CONTRACT_ADDRESS,
    abi: GAMEFI_ABI,
    functionName: 'getLevelCost',
    args: [1n],
  })

  // Write contract for game actions
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const ensureCorrectNetwork = async () => {
    if (chainId !== 50312) {
      await switchChain({ chainId: 50312 })
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const startLevel = async (level: number) => {
    await ensureCorrectNetwork()
    
    writeContract({
      address: GAMEFI_CONTRACT_ADDRESS,
      abi: GAMEFI_ABI,
      functionName: 'startLevel',
      args: [BigInt(level)],
    })
  }

  const completeLevel = async (gems: number) => {
    await ensureCorrectNetwork()
    
    writeContract({
      address: GAMEFI_CONTRACT_ADDRESS,
      abi: GAMEFI_ABI,
      functionName: 'completeLevel',
      args: [BigInt(gems)],
    })
  }

  const failGame = async () => {
    await ensureCorrectNetwork()
    
    writeContract({
      address: GAMEFI_CONTRACT_ADDRESS,
      abi: GAMEFI_ABI,
      functionName: 'failGame',
    })
  }

  const exitGame = async () => {
    await ensureCorrectNetwork()
    
    writeContract({
      address: GAMEFI_CONTRACT_ADDRESS,
      abi: GAMEFI_ABI,
      functionName: 'exitGame',
    })
  }

  const getLevelCosts = () => [1, 2, 3, 4, 5] // STT costs for levels 1-5

  return {
    gameSession,
    startLevel,
    completeLevel,
    failGame,
    exitGame,
    getLevelCosts,
    isPending,
    isConfirming,
    isConfirmed,
    refetchSession,
  }
}