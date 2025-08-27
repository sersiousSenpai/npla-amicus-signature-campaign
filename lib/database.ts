import { supabaseServer, type Signature, type CampaignGoal } from './supabase-server'

// Get all signatures with pagination
export async function getSignatures(limit = 100, offset = 0) {
  const { data, error } = await supabaseServer
    .from('signatures')
    .select('*')
    .order('timestamp', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data || []
}

// Get signature statistics
export async function getSignatureStats() {
  const { data: signatures, error: sigError } = await supabaseServer
    .from('signatures')
    .select('law_school, year, organization, timestamp')

  if (sigError) throw sigError

  let goals
  try {
    const { data, error } = await supabaseServer
      .from('campaign_goals')
      .select('id, current_goal')
      .single()

    if (error) {
      // If no campaign goal exists, create one
      const { data: newGoal } = await supabaseServer
        .from('campaign_goals')
        .insert([{ current_goal: 250, last_updated: new Date().toISOString() }])
        .select('id, current_goal')
        .single()
      
      goals = newGoal
    } else {
      goals = data
    }
  } catch (error) {
    // Fallback to default goal
    goals = { id: 1, current_goal: 250 }
  }

  // Process statistics
  const lawSchools: Record<string, number> = {}
  const yearCounts: Record<string, number> = {}
  const organizations: Record<string, number> = {}

  signatures?.forEach(sig => {
    // Count law schools
    if (sig.law_school) {
      lawSchools[sig.law_school] = (lawSchools[sig.law_school] || 0) + 1
    }
    
    // Count years
    if (sig.year) {
      yearCounts[sig.year] = (yearCounts[sig.year] || 0) + 1
    }
    
    // Count organizations
    if (sig.organization) {
      organizations[sig.organization] = (organizations[sig.organization] || 0) + 1
    }
  })

  const total = signatures?.length || 0
  let currentGoal = goals?.current_goal || 250 // Start at 250

  // If we have 0 signatures and goal is not 250, reset to 250
  if (total === 0 && currentGoal !== 250) {
    currentGoal = 250
    await supabaseServer
      .from('campaign_goals')
      .update({ current_goal: currentGoal, last_updated: new Date().toISOString() })
      .eq('id', goals?.id)
  }
  // Auto-adjust goal if we reach 90% of current goal
  else if (total >= currentGoal * 0.9) {
    currentGoal = currentGoal + 125 // Increase by 125 for nice round numbers
    
    // Update goal in database
    await supabaseServer
      .from('campaign_goals')
      .update({ current_goal: currentGoal, last_updated: new Date().toISOString() })
      .eq('id', goals?.id)
  }

  return {
    total,
    goal: currentGoal,
    lawSchools,
    yearCounts,
    organizations,
    signatures: signatures?.slice(0, 50) || [] // Recent 50 signatures
  }
}

// Add new signature
export async function addSignature(signature: Omit<Signature, 'id' | 'timestamp'>) {
  const { data, error } = await supabaseServer
    .from('signatures')
    .insert([signature])
    .select()
    .single()

  if (error) throw error
  return data
}

// Get campaign goal
export async function getCampaignGoal() {
  const { data, error } = await supabaseServer
    .from('campaign_goals')
    .select('current_goal')
    .single()

  if (error) throw error
  return data?.current_goal || 250 // Start at 250
}

// Initialize campaign goal if it doesn't exist
export async function initializeCampaignGoal() {
  const { data: existingGoal } = await supabase
    .from('campaign_goals')
    .select('id')
    .single()

  if (!existingGoal) {
    const { data, error } = await supabase
      .from('campaign_goals')
      .insert([{ current_goal: 250, last_updated: new Date().toISOString() }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  return existingGoal
}

// Reset campaign goal to 250 (for migration from old 1000 goal)
export async function resetCampaignGoal() {
  const { data, error } = await supabase
    .from('campaign_goals')
    .update({ current_goal: 250, last_updated: new Date().toISOString() })
    .eq('id', 1) // Assuming single record with id=1
    .select()
    .single()

  if (error) throw error
  return data
}
