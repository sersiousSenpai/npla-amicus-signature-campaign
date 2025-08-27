"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import type { SignatureData } from "../utils/fetch-signatures"

interface DemographicsCardProps {
  data: SignatureData | null
  isLoading: boolean
  error: string | null
}

export function DemographicsCard({ data, isLoading, error }: DemographicsCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    console.log('Demographics data:', data?.yearCounts)
    if (!data?.yearCounts || !chartRef.current) return

    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Sort the years in a specific order: 1L, 2L, 3L, LLM
    const yearOrder = ['1L', '2L', '3L', 'LLM']
    const sortedYears = Object.entries(data.yearCounts)
      .sort(([a], [b]) => yearOrder.indexOf(a) - yearOrder.indexOf(b))
      .filter(([year]) => yearOrder.includes(year)) // Only include valid years

    console.log('Sorted years:', sortedYears)

    const total = sortedYears.reduce((sum, [_, count]) => sum + count, 0)
    const labels = sortedYears.map(([year]) => year)
    const counts = sortedYears.map(([_, count]) => count)
    const percentages = counts.map(count => ((count / total) * 100).toFixed(1))

    // Map colors to the actual data length
    const colors = [
      "#1B4332", // 1L - darkest
      "#2D6A4F", // 2L - dark
      "#40916C", // 3L - medium
      "#74C69D", // LLM - light
    ].slice(0, sortedYears.length)

    // Create the chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels.map((label, i) => `${label} (${percentages[i]}%)`),
        datasets: [{
          data: counts,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 12
              },
              color: '#2B5741'
            }
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data?.yearCounts])

  if (isLoading) {
    return (
      <div className="modern-card rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#2B5741] mb-6 flex items-center">
            <span className="inline-block w-2 h-6 bg-gradient-to-r from-[#2B5741] to-emerald-600 rounded-full mr-3"></span>
            Demographics
          </h2>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#2B5741] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#2B5741]">Loading demographic data...</p>
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
            Demographics
          </h2>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700">
            <p>Unable to load demographic data. Please try again later.</p>
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
          Demographics
        </h2>
        <div className="h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  )
} 