// Diagnostic script to test Google Sheets connection
// Run this in your browser console (F12) to test the connection

const TEST_CONFIG = {
  GOOGLE_API_KEY: 'AIzaSyAN_kshpoKprIZXZMCS-K--RTh-oNjsvGU',
  GOOGLE_SHEET_ID: '1alOj1_hZH2wvoV8YuG6bmWYjQgoHOowPIJsO8H9iRZI',
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxYkN5PZ2sJ26HyuoVrH5X25Ewv4g2AZ99Qq214xm03NmyRNYrrysHjcV-6WDN8PSrjjQ/exec',
  SHEET_NAME: 'Leads'
};

async function testGoogleSheetsAPI() {
  console.log('🔍 Testing Google Sheets API...\n');
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${TEST_CONFIG.GOOGLE_SHEET_ID}/values/${TEST_CONFIG.SHEET_NAME}!A:Z?key=${TEST_CONFIG.GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    console.log('✅ API Response Status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ API Error:', error);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Data received:', data);
    
    if (data.values && data.values.length > 0) {
      console.log(`✅ Found ${data.values.length} rows (including header)`);
      console.log('📋 Headers:', data.values[0]);
      return true;
    } else {
      console.warn('⚠️ Sheet is empty or "Leads" tab not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    return false;
  }
}

async function testAppsScript() {
  console.log('\n🔍 Testing Google Apps Script...\n');
  
  const url = `${TEST_CONFIG.GOOGLE_SCRIPT_URL}?action=getClients`;
  
  try {
    const response = await fetch(url);
    console.log('✅ Apps Script Response Status:', response.status);
    
    const text = await response.text();
    console.log('📄 Raw response:', text.substring(0, 200));
    
    if (text.startsWith('[') || text.startsWith('{')) {
      const data = JSON.parse(text);
      console.log('✅ Parsed data:', data);
      return true;
    } else {
      console.warn('⚠️ Response is not JSON');
      return false;
    }
  } catch (error) {
    console.error('❌ Apps Script Error:', error);
    return false;
  }
}

async function runDiagnostics() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   Google Sheets Connection Test      ║');
  console.log('╚══════════════════════════════════════╝\n');
  
  console.log('Config:');
  console.log('- Sheet ID:', TEST_CONFIG.GOOGLE_SHEET_ID);
  console.log('- Sheet Name:', TEST_CONFIG.SHEET_NAME);
  console.log('- API Key:', TEST_CONFIG.GOOGLE_API_KEY ? 'Set ✓' : 'Missing ✗');
  console.log('- Apps Script URL:', TEST_CONFIG.GOOGLE_SCRIPT_URL ? 'Set ✓' : 'Missing ✗');
  console.log('');
  
  const apiResult = await testGoogleSheetsAPI();
  const scriptResult = await testAppsScript();
  
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║            Test Results              ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║ Google Sheets API: ${apiResult ? '✅ PASS' : '❌ FAIL'}      ║`);
  console.log(`║ Apps Script:       ${scriptResult ? '✅ PASS' : '❌ FAIL'}      ║`);
  console.log('╚══════════════════════════════════════╝');
  
  if (!apiResult && !scriptResult) {
    console.log('\n🔧 Possible fixes:');
    console.log('1. Make sure Google Sheet is shared (click Share > Anyone with link can view)');
    console.log('2. Check if "Leads" tab exists in your sheet');
    console.log('3. Verify the Sheet ID is correct');
    console.log('4. Check if Google Sheets API is enabled in Google Cloud Console');
  }
}

// Export for use
declare global {
  interface Window {
    testGoogleSheets: () => Promise<void>;
  }
}

if (typeof window !== 'undefined') {
  window.testGoogleSheets = runDiagnostics;
  console.log('💡 Run testGoogleSheets() in console to diagnose connection');
}

export { runDiagnostics, testGoogleSheetsAPI, testAppsScript };
