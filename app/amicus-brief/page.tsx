"use client"

import { useState, useEffect } from "react"
import { SignatureTracker } from "./components/signature-tracker"
import { DemographicsCard } from "./components/demographics-card"
import { ScrollLists } from "./components/scroll-lists"
import SignatureForm from "./components/signature-form"
import { fetchSignatureData, type SignatureData } from "./utils/fetch-signatures"

export default function AmicusBriefPage() {
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Load signatures data
  useEffect(() => {
    async function loadSignatures() {
      try {
        setIsLoading(true)
        const data = await fetchSignatureData()
        setSignatureData(data)
        setError(null)
      } catch (error) {
        console.error("Error loading signatures:", error)
        setError("Failed to load signature data")
      } finally {
        setIsLoading(false)
      }
    }

    loadSignatures()
    const intervalId = setInterval(loadSignatures, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-14">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2B5741] to-emerald-600 text-transparent bg-clip-text mb-4 pb-1">
          Sign the Law Student Amicus Brief
        </h1>
        <p className="text-xl text-[#2B5741]/90 max-w-3xl">
          Join law students nationwide in supporting Susman Godfrey's Motion for Summary Judgment.
        </p>
      </section>

      {!showForm ? (
        <>
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-800">Thank You for Signing!</h3>
                    <p className="text-green-700">Your signature has been successfully added to the amicus brief. You're now part of this important legal initiative!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-green-600 hover:text-green-800 transition-colors"
                  aria-label="Close success message"
                  title="Close success message"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <section className="mb-14">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2B5741] to-emerald-600 text-transparent bg-clip-text mb-8 flex items-center">
              <span className="inline-block w-2.5 h-7 bg-gradient-to-r from-[#2B5741] to-emerald-600 rounded-full mr-3"></span>
              Campaign Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SignatureTracker 
                data={signatureData} 
                isLoading={isLoading} 
                error={error}
                onShowForm={() => setShowForm(true)}
              />
              <DemographicsCard 
                data={signatureData}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2B5741] to-emerald-600 text-transparent bg-clip-text mb-8 flex items-center">
              <span className="inline-block w-2.5 h-7 bg-gradient-to-r from-[#2B5741] to-emerald-600 rounded-full mr-3"></span>
              Recent Signatures
            </h2>
            <ScrollLists 
              data={signatureData} 
              isLoading={isLoading} 
              error={error} 
            />
          </section>
        </>
      ) : (
        <SignatureForm onBack={() => {
          setShowForm(false)
          setShowSuccessMessage(true)
        }} />
      )}
    </main>
  )
}
