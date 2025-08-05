import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { GAMEFI_ABI, GAMEFI_CONTRACT_ADDRESS, STT_ABI, STT_TOKEN_ADDRESS } from '@/lib/gamefi-contract'
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

  // Read STT balance
  const { data: sttBalance } = useReadContract({
    address: STT_TOKEN_ADDRESS,
    abi: STT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })
  
  // Get STT tokens from faucet
  const getTokens = async () => {
    await ensureCorrectNetwork()
    
    writeContract({
      address: STT_TOKEN_ADDRESS,
      abi: STT_ABI,
      functionName: 'faucet',
    })
  }

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
    
    // Approve large amount to avoid repeated approvals
    const approvalAmount = parseEther('1000') // Approve 1000 STT
    
    writeContract({
      address: STT_TOKEN_ADDRESS,
      abi: STT_ABI,
      functionName: 'approve',
      args: [GAMEFI_CONTRACT_ADDRESS, approvalAmount],
    })
  }
  
  const actuallyStartLevel = async (level: number) => {
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

  const exitGame = async (gems: number) => {
    await ensureCorrectNetwork()
    
    writeContract({
      address: GAMEFI_CONTRACT_ADDRESS,
      abi: GAMEFI_ABI,
      functionName: 'exitGame',
      args: [BigInt(gems)],
    })
  }

  const getLevelCosts = () => [0.1, 0.2, 0.3, 0.4, 0.5] // STT costs for levels 1-5

  return {
    gameSession,
    sttBalance,
    startLevel,
    actuallyStartLevel,
    completeLevel,
    failGame,
    exitGame,
    getTokens,
    getLevelCosts,
    isPending,
    isConfirming,
    isConfirmed,
    refetchSession,
  }
}