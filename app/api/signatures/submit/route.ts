import { NextResponse } from 'next/server'
import { addSignature } from '@/lib/database'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.law_school || !body.year) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, law_school, year' },
        { status: 400 }
      )
    }

    // Get client IP address
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

    // Create signature object
    const signature = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      law_school: body.law_school.trim(),
      year: body.year.trim(),
      organization: body.organization?.trim() || null,
      comments: body.comments?.trim() || null,
      ip_address: ip
    }

    // Add to database
    const result = await addSignature(signature)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Signature added successfully',
        signature: result
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error adding signature:', error)
    
    return NextResponse.json(
      { error: 'Failed to add signature', details: error.message },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
