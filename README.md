<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# RealEstate CRM Pro

A modern real estate CRM application with Google Sheets integration for data persistence and AI-powered assistant.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in [.env.local](.env.local):
   - `GOOGLE_API_KEY` - Your Google Cloud API key
   - `GOOGLE_SHEET_ID` - Your Google Sheet ID
   - `GOOGLE_SCRIPT_URL` - Google Apps Script web app URL
   - `GEMINI_API_KEY` - Your Gemini API key (optional)
   - `OPENAI_API_KEY` - Your OpenAI API key (optional)

3. Run the app:
   ```bash
   npm run dev
   ```

## Google Sheets Integration Setup

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name the first sheet/tab as "Leads" 
3. Add the following headers in row 1:
   - Name
   - Phone
   - Email
   - Profession
   - City
   - Location
   - Status
   - Notes
   - Project Name
   - Budget Range
   - Property Type
   - Follow Up Date
   - Client Image URL

### 2. Get Google Sheet ID

1. Open your Google Sheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID/edit
   ```
3. Add it to `.env.local` as `GOOGLE_SHEET_ID`

### 3. Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the key and add it to `.env.local` as `GOOGLE_API_KEY`

### 4. Set up Google Apps Script (For Write Operations)

To save and update data in Google Sheets, you need to deploy a Google Apps Script:

1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Replace the default code with:

```javascript
function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  
  if (action === 'getClients') {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const clients = rows.map((row, index) => {
      const client = { id: (index + 1).toString() };
      headers.forEach((header, i) => {
        const key = header.toLowerCase().replace(/\s+/g, '');
        client[key] = row[i] || '';
      });
      return client;
    });
    
    return ContentService.createTextOutput(JSON.stringify(clients))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  
  if (data.action === 'addClient') {
    const client = data.data;
    sheet.appendRow([
      client.name,
      client.phone,
      client.email,
      client.profession,
      client.city,
      client.location,
      client.status,
      client.notes,
      client.projectName,
      client.budgetRange,
      client.propertyType,
      client.followUpDate,
      client.avatar
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }
  
  if (data.action === 'updateClient') {
    // Implementation for updating existing client
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }));
}
```

4. Save the project (Ctrl+S)
5. Click **Deploy** > **New deployment**
6. Select type: **Web app**
7. Configure:
   - Description: "CRM Data API"
   - Execute as: **Me**
   - Who has access: **Anyone** (or restrict as needed)
8. Click **Deploy** and authorize the app
9. Copy the **Web App URL** and add it to `.env.local` as `GOOGLE_SCRIPT_URL`

### 5. Configure Environment Variables

Edit `.env.local` with your actual values:

```bash
GOOGLE_API_KEY=your_actual_api_key_here
GOOGLE_SHEET_ID=your_actual_sheet_id_here
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
GEMINI_API_KEY=your_gemini_key_here  # Optional, for AI features
OPENAI_API_KEY=your_openai_key_here  # Optional, for AI features
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## AI Features

The app includes an AI assistant that can:
- Analyze your client database
- Help with follow-up reminders
- Provide insights on leads
- Answer questions about your CRM data

Configure either Gemini or OpenAI API key to enable AI features.

## Features

- 📊 **Dashboard**: View all contacts and today's follow-ups
- 🔍 **Search**: Quick search through all clients
- ➕ **Add Clients**: Easy form to add new leads
- 📈 **Analytics**: Visual insights on your pipeline
- 🤖 **AI Assistant**: Get help with your CRM data
- 📱 **Mobile Responsive**: Works on all devices
- 🌙 **Dark Mode**: Toggle between light and dark themes

## Data Flow

1. **Read Operations**: Uses Google Sheets API (fast, no CORS issues)
2. **Write Operations**: Uses Google Apps Script Web App (handles POST requests)
3. **Fallback**: If API fails, app uses local data (INITIAL_CLIENTS)

## Troubleshooting

### Data not loading?
- Check browser console for configuration warnings
- Verify `GOOGLE_API_KEY` and `GOOGLE_SHEET_ID` in `.env.local`
- Ensure Google Sheets API is enabled in Google Cloud Console

### Can't save clients?
- Verify `GOOGLE_SCRIPT_URL` is correct
- Check that Apps Script has proper permissions
- Look for CORS errors in browser console

### AI not working?
- Add either `GEMINI_API_KEY` or `OPENAI_API_KEY` to `.env.local`
- Check API key validity and billing status

## Development

Built with:
- React + TypeScript
- Vite
- Tailwind CSS
- Recharts (analytics)
- Google Sheets API

## License

© 2024 RealEstate CRM Pro
