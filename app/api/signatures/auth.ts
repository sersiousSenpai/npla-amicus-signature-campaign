import { JWT } from "google-auth-library"

export function getGoogleAuth() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    throw new Error("Missing required environment variables")
  }

  // Format the private key
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")

  return new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
} 