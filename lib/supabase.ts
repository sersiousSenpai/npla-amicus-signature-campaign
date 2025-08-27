import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
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

export interface CampaignGoal {
  id: number
  current_goal: number
  last_updated: string
}
