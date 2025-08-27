import React from 'react'

interface PDFModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PDFModal({ isOpen, onClose }: PDFModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="relative w-full min-h-screen bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            Read the Amicus Brief
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* PDF Content */}
        <div className="p-4">
          <div className="relative w-full h-0 pb-[120%] sm:pb-[100%] md:pb-[75%] overflow-hidden rounded-lg shadow-lg bg-white">
            <iframe 
              src="https://drive.google.com/file/d/17F68ZnXQjg0IxFQEilBhkVD59yDUQAq6/preview" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay"
              title="Amicus Brief PDF"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
