import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { LEADERBOARD_ABI, CONTRACT_ADDRESSES } from '@/lib/contract'
import { useChainId } from 'wagmi'

export function useLeaderboard() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const contractAddress = CONTRACT_ADDRESSES[chainId || 50312]

  // Read top scores
  const { data: topScores, isLoading: isLoadingScores, refetch: refetchScores } = useReadContract({
    address: contractAddress,
    abi: LEADERBOARD_ABI,
    functionName: 'getTopScores',
    args: [10n], // Get top 10 scores
  })

  // Write contract for submitting scores
  const { writeContract, data: hash, isPending: isSubmitting } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const submitScore = async (score: number, gems: number) => {
    // Check if we're on the wrong network
    if (chainId !== 50312) {
      try {
        await switchChain({ chainId: 50312 })
        // Wait a moment for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        throw new Error('Please switch to Somnia Testnet to submit your score')
      }
    }
    
    const currentContractAddress = CONTRACT_ADDRESSES[50312]
    if (!currentContractAddress || currentContractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed on Somnia Testnet')
    }

    writeContract({
      address: currentContractAddress,
      abi: LEADERBOARD_ABI,
      functionName: 'submitScore',
      args: [BigInt(score), BigInt(gems)],
    })
  }

  return {
    topScores: topScores || [],
    isLoadingScores,
    submitScore,
    isSubmitting,
    isConfirming,
    isConfirmed,
    refetchScores,
  }
}