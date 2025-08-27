"use client"

import { useEffect, useRef } from "react"
import { type SignatureData } from "../utils/fetch-signatures"

interface ScrollListsProps {
  data: SignatureData | null
  isLoading: boolean
  error: string | null
}

export function ScrollLists({ data, isLoading, error }: ScrollListsProps) {
  if (isLoading) {
    return (
      <div className="modern-card rounded-xl overflow-hidden">
        <div className="p-6">
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
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700">
            <p>Unable to load signature data. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="modern-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
            <h3 className="text-lg font-semibold text-[#2B5741] flex items-center">
              <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-[#2B5741] to-emerald-600 rounded-full mr-2.5"></span>
              Law Student Signatures
            </h3>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-2">
            {data.signatures.map((signature, index) => (
              <div
                key={signature.id || index}
                className="signature-item flex items-center justify-between py-2 px-3 rounded-lg"
              >
                <div className="flex-1">
                  <span className="text-[#2B5741]">{signature.law_school} ({signature.year})</span>
                </div>
                <div className="text-[#2B5741] text-sm ml-4">
                  {signature.timestamp ? 
                    new Date(signature.timestamp).toLocaleDateString('en-US', { 
                      month: '2-digit', 
                      day: '2-digit', 
                      year: '2-digit'
                    }) : 
                    'N/A'
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modern-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
            <h3 className="text-lg font-semibold text-[#2B5741] flex items-center">
              <span className="inline-block w-1.5 h-5 bg-gradient-to-b from-[#2B5741] to-emerald-600 rounded-full mr-2.5"></span>
              Organization Signatures
            </h3>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-2">
            {Object.entries(data.organizations).map(([org], index) => (
              <div
                key={org}
                className="signature-item flex items-center justify-between py-2 px-3 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium text-[#2B5741]">{org}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
