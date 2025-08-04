import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { LEADERBOARD_ABI, CONTRACT_ADDRESSES } from '@/lib/contract'
import { useChainId } from 'wagmi'

export function useLeaderboard() {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId]

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
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed on this network. Please deploy the MineEscapeLeaderboard contract first.')
    }

    writeContract({
      address: contractAddress,
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