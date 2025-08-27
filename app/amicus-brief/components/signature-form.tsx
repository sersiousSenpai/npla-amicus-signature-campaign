'use client'

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group'

import { toast } from 'sonner'
import lawSchools from '../../../data/law-schools.json'
import PDFModal from './pdf-modal'

interface SignatureFormData {
  email: string
  name: string
  lawSchool: string
  year: string
  signingForOrg: 'yes' | 'no'
  organizationName?: string
  positionInOrg?: string
  comments?: string
}

const yearOptions = ['1L', '2L', '3L', 'LLM']

interface SignatureFormProps {
  onBack: () => void
  onSuccess: () => void
}

export default function SignatureForm({ onBack, onSuccess }: SignatureFormProps) {
  const [formData, setFormData] = useState<SignatureFormData>({
    email: '',
    name: '',
    lawSchool: '',
    year: '',
    signingForOrg: 'no'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lawSchoolSearch, setLawSchoolSearch] = useState('')
  const [isLawSchoolOpen, setIsLawSchoolOpen] = useState(false)
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  const handleInputChange = (field: keyof SignatureFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Filter law schools based on search
  const filteredLawSchools = lawSchools.filter(school =>
    school.toLowerCase().includes(lawSchoolSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.name || !formData.lawSchool || !formData.year) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.signingForOrg === 'yes' && (!formData.organizationName || !formData.positionInOrg)) {
      toast.error('Please fill in organization details')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/signatures/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          law_school: formData.lawSchool,
          year: formData.year,
          organization: formData.organizationName || null,
          comments: formData.comments || null
        }),
      })

      if (response.ok) {
        console.log('Form submitted successfully, calling onSuccess in 1.5 seconds...')
        toast.success('Thank you! Your signature has been successfully added to the amicus brief.')
        // Reset form
        setFormData({
          email: '',
          name: '',
          lawSchool: '',
          year: '',
          signingForOrg: 'no'
        })
        // Return to campaign progress page after a short delay
        setTimeout(() => {
          console.log('Timeout completed, calling onSuccess()')
          onSuccess()
        }, 1500)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit signature')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-[#2B5741] hover:text-emerald-600 transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Campaign
        </button>
        
        <button
          onClick={() => setIsPDFModalOpen(true)}
          className="flex items-center text-[#2B5741] hover:text-emerald-600 transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View the Brief
        </button>
      </div>
      
      <div className="modern-card rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#2B5741] mb-6 flex items-center">
            <span className="inline-block w-2 h-6 bg-gradient-to-r from-[#2B5741] to-emerald-600 rounded-full mr-3"></span>
            Sign the Amicus Brief
          </h2>
          <p className="text-[#2B5741]/90 mb-8 max-w-3xl">
            Add your signature to support this important legal initiative
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-[#2B5741] font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@law.edu"
                required
                className="bg-white border-gray-200 focus:border-[#2B5741] focus:ring-[#2B5741] text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-[#2B5741] font-medium">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                required
                className="bg-white border-gray-200 focus:border-[#2B5741] focus:ring-[#2B5741] text-gray-900 placeholder-gray-500"
              />
            </div>

                      {/* Law School */}
            <div className="space-y-2">
              <Label htmlFor="lawSchool" className="text-sm text-[#2B5741] font-medium">Law School *</Label>
              <Select
                value={formData.lawSchool}
                onValueChange={(value) => {
                  handleInputChange('lawSchool', value)
                  setIsLawSchoolOpen(false)
                  setLawSchoolSearch('')
                }}
                open={isLawSchoolOpen}
                onOpenChange={setIsLawSchoolOpen}
                required
              >
                <SelectTrigger className="bg-white border-gray-200 focus:border-[#2B5741] focus:ring-[#2B5741] text-gray-900">
                  <SelectValue placeholder="Select your law school" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg p-0" position="popper" side="bottom" align="start">
                  <div className="p-3 border-b border-gray-200">
                    <Input
                      placeholder="Search law schools..."
                      value={lawSchoolSearch}
                      onChange={(e) => setLawSchoolSearch(e.target.value)}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                        if (e.key === 'Escape') {
                          setIsLawSchoolOpen(false)
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      className="border-0 focus:ring-0 text-gray-900 placeholder-gray-500 bg-transparent"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredLawSchools.length > 0 ? (
                      filteredLawSchools.map((school, index) => (
                        <SelectItem key={index} value={school} className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50">
                          {school}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">
                        {lawSchoolSearch ? 'No law schools found' : 'No law schools configured'}
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm text-[#2B5741] font-medium">Year *</Label>
              <Select
                value={formData.year}
                onValueChange={(value) => handleInputChange('year', value)}
                required
              >
                <SelectTrigger className="bg-white border-gray-200 focus:border-[#2B5741] focus:ring-[#2B5741] text-gray-900">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year} className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                      {/* Organization Question */}
            <div className="space-y-2">
              <Label className="text-sm text-[#2B5741] font-medium">Are you signing on behalf of an organization? *</Label>
              <RadioGroup
                value={formData.signingForOrg}
                onValueChange={(value: 'yes' | 'no') => handleInputChange('signingForOrg', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" className="text-[#2B5741] border-gray-200 bg-white" />
                  <Label htmlFor="yes" className="text-[#2B5741]">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" className="text-[#2B5741] border-gray-200 bg-white" />
                  <Label htmlFor="no" className="text-[#2B5741]">No</Label>
                </div>
              </RadioGroup>
            </div>

                      {/* Conditional Organization Fields */}
            {formData.signingForOrg === 'yes' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organizationName" className="text-sm text-[#2B5741] font-medium">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    value={formData.organizationName || ''}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Organization name"
                    required
                    className="bg-white border-gray-200 focus:border-[#2B5741] focus:ring-[#2B5741] text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionInOrg" className="text-sm text-[#2B5741] font-medium">Position in Organization *</Label>
                  <Input
                    id="positionInOrg"
                    type="text"
                    value={formData.positionInOrg || ''}
                    onChange={(e) => handleInputChange('positionInOrg', e.target.value)}
                    placeholder="e.g., President, Member, etc."
                    required
                    className="bg-white border-gray-200 focus:border-[#2B5741] focus:ring-[#2B5741] text-gray-900 placeholder-gray-500"
                  />
                </div>
              </>
            )}

                      {/* Comments (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm text-[#2B5741] font-medium">Additional Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={formData.comments || ''}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                placeholder="Any additional thoughts or comments..."
                rows={3}
                className="bg-white border-gray-200 focus:border-[#2B5741] focus:ring-[#2B5741] text-gray-900 placeholder-gray-500"
              />
            </div>

                        {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full py-3 px-4 bg-gradient-to-r from-[#2B5741] to-emerald-600 hover:from-[#1A4231] hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Signature'}
            </Button>

            {/* Legal Disclaimer */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-lg border border-green-100/50">
              <div className="flex items-start mb-3">
                <span className="inline-block w-1.5 h-4 bg-gradient-to-b from-[#2B5741] to-emerald-600 rounded-full mr-2.5 mt-1 flex-shrink-0"></span>
                <p className="text-xs text-[#2B5741]/80 leading-relaxed">
                  By signing this form and clicking submit, you authorize Kline & Specter to include your name and/or organization name on the list of signatories in support of the amicus brief and you agree to be included as an amicus curiae in support of the appellees in the Perkins Coie, Susman Godfrey, WilmerHale, and Jenner & Block cases, and in any subsequent appellate proceedings in these matters. You further acknowledge that you have had an opportunity to review the brief and understand that it will be publicly filed in this case. You acknowledge that your name and/or organization name will be listed with the full name that you provide to us as well as your law school affiliation, and that you are a student at the law school you are listing. Other than in connection with filing this amicus brief, you acknowledge that there is no attorney-client relationship between you and/or your organization and Kline & Specter / Walkup Melodia and you are not relying on Kline & Specter / Walkup Melodia or any of their lawyers with legal advice in this or any other matter. Thank you for your participation in this amicus brief.
                </p>
              </div>
              
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-4 bg-gradient-to-b from-[#2B5741] to-emerald-600 rounded-full mr-2.5 mt-1 flex-shrink-0"></span>
                <p className="text-xs text-[#2B5741]/80">
                  The NPLA Privacy Policy on data collection can be reviewed {' '}
                  <a 
                    href="https://www.nationalplaintiffslawassociation.org/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#2B5741] hover:text-emerald-600 underline transition-colors font-medium"
                  >
                    here
                  </a>.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* PDF Modal */}
      <PDFModal 
        isOpen={isPDFModalOpen} 
        onClose={() => setIsPDFModalOpen(false)} 
      />
    </div>
  )
}
