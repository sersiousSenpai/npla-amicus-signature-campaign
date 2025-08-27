import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

async function testGoogleSheets() {
  try {
    // Create JWT client
    const jwt = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Initialize the Google Spreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwt);
    await doc.loadInfo();

    console.log('Successfully connected to Google Sheet:', doc.title);

    // Get the first sheet
    const sheet = doc.sheetsByIndex[0];
    console.log('Sheet name:', sheet.title);

    // Load cells
    await sheet.loadCells('A1:B2');

    // Check the total signatures and goal
    const totalCell = sheet.getCellByA1('B1');
    const goalCell = sheet.getCellByA1('B2');
    console.log('Total signatures:', totalCell.value);
    console.log('Signature goal:', goalCell.value);

    // Load all rows
    const rows = await sheet.getRows();
    console.log('Number of rows:', rows.length);

    // Print the first few rows
    console.log('First few rows:');
    rows.slice(0, 5).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row.toObject());
    });

  } catch (error) {
    console.error('Error testing Google Sheets:', error);
  }
}

testGoogleSheets(); 