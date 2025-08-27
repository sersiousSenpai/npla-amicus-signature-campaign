import { NextResponse } from 'next/server'
import { getSignatureStats } from '@/lib/database'

export async function GET() {
  try {
    const stats = await getSignatureStats()
    
    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  } catch (error: any) {
    console.error('Error in signatures API:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch signatures', details: error.message },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
