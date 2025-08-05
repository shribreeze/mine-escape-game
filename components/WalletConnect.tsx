"use client"

import { CheckCircle, LogOut } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { useEffect, useState } from 'react'

interface WalletConnectProps {
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [showDisconnect, setShowDisconnect] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      onConnect()
    } else {
      onDisconnect()
    }
  }, [isConnected, address, onConnect, onDisconnect])

  const handleDisconnect = () => {
    disconnect()
    setShowDisconnect(false)
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <div
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg backdrop-blur-sm border border-green-400/30 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          onClick={() => setShowDisconnect(!showDisconnect)}
        >
          <CheckCircle className="w-4 h-4 text-white" />
          <span className="text-sm font-medium">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
        </div>
        
        {showDisconnect && (
          <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50">
            <button
              onClick={handleDisconnect}
              className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Disconnect</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rainbow-kit-wrapper">
      <ConnectButton />
    </div>
  )
}