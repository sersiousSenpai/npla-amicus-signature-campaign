import { NextResponse } from "next/server"
import { google } from 'googleapis'

export async function GET() {
  try {
    // Log all environment variables for debugging
    console.log("Environment check:", {
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      sheetId: process.env.GOOGLE_SHEET_ID,
      hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
      keyLength: process.env.GOOGLE_PRIVATE_KEY?.length
    })

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      throw new Error("Missing required environment variables")
    }

    // Format private key
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || ""
    privateKey = privateKey.replace(/^["']|["']$/g, "")
    privateKey = privateKey.replace(/\\n/g, "\n")

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: "artful-memento-457519-e9",
        private_key: privateKey,
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    // Create sheets client
    const sheets = google.sheets({ version: 'v4', auth })

    // Try to get spreadsheet metadata first
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    })

    // Then try to get values
    const values = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Form Responses 1!A1:D1',
    })

    return NextResponse.json({
      success: true,
      metadata: {
        title: metadata.data.properties?.title,
        sheets: metadata.data.sheets?.map(s => s.properties?.title),
      },
      headers: values.data.values?.[0],
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