"use client"

import { useEffect, useState } from "react"
import { fetchSignatureData } from "../amicus-brief/utils/fetch-signatures"

export default function TestPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const result = await fetchSignatureData()
        setData(result)
      } catch (err) {
        console.error("Error:", err)
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      {data && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Data from Google Sheets:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[500px]">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
