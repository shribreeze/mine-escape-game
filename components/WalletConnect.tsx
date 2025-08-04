"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'

interface WalletConnectProps {
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      onConnect()
    } else {
      onDisconnect()
    }
  }, [isConnected, address, onConnect, onDisconnect])

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg backdrop-blur-sm border border-green-400/30"
      >
        <CheckCircle className="w-4 h-4 text-white" />
        <span className="text-sm font-medium">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      </motion.div>
    )
  }

  return (
    <div className="rainbow-kit-wrapper">
      <ConnectButton />
    </div>
  )
}