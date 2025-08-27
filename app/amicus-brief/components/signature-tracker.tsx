"use client"

import { type SignatureData } from "../utils/fetch-signatures"

interface SignatureTrackerProps {
  data: SignatureData | null
  isLoading: boolean
  error: string | null
  onShowForm: () => void
}

export function SignatureTracker({ data, isLoading, error, onShowForm }: SignatureTrackerProps) {
  // Calculate percentage if data is available
  const percentComplete = data ? Math.round((data.total / data.goal) * 100) : 0

  if (isLoading) {
    return (
      <div className="modern-card rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#2B5741] mb-6 flex items-center">
            <span className="inline-block w-2 h-6 bg-gradient-to-r from-[#2B5741] to-emerald-600 rounded-full mr-3"></span>
            Signature Tracker
          </h2>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#2B5741] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#2B5741]">Loading signature data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="modern-card rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#2B5741] mb-6 flex items-center">
            <span className="inline-block w-2 h-6 bg-gradient-to-r from-[#2B5741] to-emerald-600 rounded-full mr-3"></span>
            Signature Tracker
          </h2>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700">
            <p>Unable to load signature data. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modern-card rounded-xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#2B5741] mb-6 flex items-center">
          <span className="inline-block w-2 h-6 bg-gradient-to-r from-[#2B5741] to-emerald-600 rounded-full mr-3"></span>
          Signature Tracker
        </h2>
        <div className="space-y-8">
          <div>
            <div className="text-sm text-[#2B5741] mb-2">Progress</div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-[#E5EFE9]">
                <div
                  style={{ width: `${Math.min(percentComplete, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#2B5741] to-emerald-600 transition-all duration-500 ease-out rounded-full"
                ></div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#2B5741] mb-1">Current</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-[#2B5741] to-emerald-600 text-transparent bg-clip-text">{data.total}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#2B5741] mb-1">Goal</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-[#2B5741] to-emerald-600 text-transparent bg-clip-text">{data.goal}</p>
            </div>
          </div>

          <button 
            onClick={onShowForm}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#2B5741] to-emerald-600 hover:from-[#1A4231] hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg"
          >
            View & Sign the Amicus Brief
          </button>
        </div>
      </div>
    </div>
  )
}
