import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Test Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test a simple query
    const { data, error } = await supabase
      .from('campaign_goals')
      .select('*')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      data: data,
      env: {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseKey: !!supabaseKey,
        urlLength: supabaseUrl?.length
      }
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    }, { status: 500 })
  }
} 