export type RawEntry = {
  lawStudentLawSchool: string
  lawStudentYear: string
  lawStudentOrganization: string
}

export interface Signature {
  id: number
  name: string
  email: string
  law_school: string
  year: string
  organization?: string
  comments?: string
  timestamp: string
  ip_address?: string
}

export interface SignatureData {
  total: number
  goal: number
  lawSchools: Record<string, number>
  yearCounts: Record<string, number>
  organizations: Record<string, number>
  signatures: Signature[]
}

export async function fetchSignatureData(): Promise<SignatureData> {
  const response = await fetch('/api/signatures', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
  })
  
  if (!response.ok) {
    throw new Error("Failed to fetch signature data")
  }
  return response.json()
}
