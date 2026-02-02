
import { GOOGLE_SCRIPT_URL } from '../constants';
import { Client } from '../types';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || '';

// Sheet name and range
const SHEET_NAME = 'Leads';
const RANGE = 'A:Z'; // Expanded range to catch more columns

// Configuration validation
const validateConfig = () => {
  const issues: string[] = [];
  
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    issues.push('GOOGLE_SCRIPT_URL not configured or contains placeholder');
  }
  
  if (!GOOGLE_API_KEY) {
    issues.push('GOOGLE_API_KEY not configured in .env.local');
  }
  
  if (!GOOGLE_SHEET_ID) {
    issues.push('GOOGLE_SHEET_ID not configured in .env.local');
  }
  
  if (issues.length > 0) {
    console.warn('[Google Sheets] Configuration issues:', issues);
    return false;
  }
  
  return true;
};

export const googleSheetService = {
  /**
   * Fetch clients directly from Google Sheets API
   */
  async fetchClients(): Promise<Client[]> {
    console.log('[fetchClients] Starting fetch...');
    
    // Validate configuration on first call
    const isConfigValid = validateConfig();
    console.log('[fetchClients] Config validation result:', isConfigValid);
    console.log('[fetchClients] GOOGLE_SCRIPT_URL:', GOOGLE_SCRIPT_URL ? 'Set' : 'Not set');
    console.log('[fetchClients] GOOGLE_SCRIPT_URL contains YOUR_SCRIPT_ID:', GOOGLE_SCRIPT_URL?.includes('YOUR_SCRIPT_ID'));
    console.log('[fetchClients] GOOGLE_API_KEY:', GOOGLE_API_KEY ? 'Set' : 'Not set');
    console.log('[fetchClients] GOOGLE_SHEET_ID:', GOOGLE_SHEET_ID ? 'Set' : 'Not set');
    
    try {
      // Try Google Sheets API FIRST (it's faster for reading)
      if (GOOGLE_API_KEY && GOOGLE_SHEET_ID) {
        console.log('[fetchClients] Attempting to fetch from Google Sheets API (primary method - faster)...');
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=${GOOGLE_API_KEY}`;
        console.log('[fetchClients] Google Sheets API URL:', url.replace(GOOGLE_API_KEY, '***API_KEY***'));
        
        try {
          const response = await fetch(url);
          console.log('[fetchClients] Google Sheets API response status:', response.status, response.ok);

          if (response.ok) {
            const data = await response.json();
            console.log('[fetchClients] Google Sheets API response data received');
            
            const rows = data.values || [];
            console.log('[fetchClients] Total rows from sheet:', rows.length);

            if (rows.length > 1) {
              // Parse rows into Client objects (assuming first row is headers)
              const headers = rows[0];
              console.log('[fetchClients] Headers found:', headers);
              
              const clients: Client[] = rows.slice(1).map((row: string[], index: number) => {
                const client: Record<string, any> = { id: (index + 1).toString() };

                headers.forEach((header: string, i: number) => {
                  const key = header.toLowerCase().replace(/\s+/g, '');
                  const value = row[i] || '';

                  // Map sheet columns to Client properties
                  switch (key) {
                    case 'name':
                    case 'clientname':
                      client.name = value;
                      break;
                    case 'phone':
                    case 'contact':
                      client.phone = value;
                      break;
                    case 'email':
                      client.email = value;
                      break;
                    case 'profession':
                      client.profession = value;
                      break;
                    case 'city':
                      client.city = value;
                      break;
                    case 'location':
                      client.location = value;
                      break;
                    case 'status':
                      client.status = value || 'New Lead';
                      break;
                    case 'notes':
                      client.notes = value;
                      break;
                    case 'projectname':
                    case 'project':
                      client.projectName = value;
                      break;
                    case 'budget':
                    case 'budgetrange':
                      client.budgetRange = value;
                      break;
                    case 'propertytype':
                      client.propertyType = value;
                      break;
                    case 'followupdate':
                      client.followUpDate = value;
                      break;
                    case 'clientimageurl':
                    case 'image':
                    case 'avatar':
                      client.avatar = value;
                      break;
                    default:
                      break;
                  }
                });

                // Set defaults
                client.avatar = client.avatar || `https://picsum.photos/seed/${client.name?.replace(/\s/g, '') || index}/200`;
                client.location = client.location || client.city || '';
                client.status = client.status || 'New Lead';

                return client as Client;
              });

              console.log('[fetchClients] Successfully parsed clients from Google Sheets API. Count:', clients.length);
              return clients;
            } else {
              console.log('[fetchClients] No data or only headers found in Google Sheets API');
              return [];
            }
          } else {
            const errorText = await response.text();
            console.error('[fetchClients] Google Sheets API error response:', errorText);
            console.log('[fetchClients] Google Sheets API failed, will try Apps Script fallback...');
          }
        } catch (apiError) {
          console.error('[fetchClients] Error fetching from Google Sheets API:', apiError);
          console.log('[fetchClients] Google Sheets API failed, will try Apps Script fallback...');
        }
      } else {
        console.log('[fetchClients] Google Sheets API not configured (missing API_KEY or SHEET_ID), skipping to Apps Script...');
      }

      // Fallback to Apps Script if Google Sheets API fails or is not configured
      const isAppsScriptUrlValid = GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID');
      console.log('[fetchClients] Apps Script URL valid?', isAppsScriptUrlValid);
      
      if (isAppsScriptUrlValid) {
        console.log('[fetchClients] Falling back to Apps Script (fallback method)...');
        const appsScriptUrl = `${GOOGLE_SCRIPT_URL}?action=getClients`;
        console.log('[fetchClients] Attempting to fetch from Apps Script:', appsScriptUrl);
        
        try {
          const appsScriptResponse = await fetch(appsScriptUrl);
          console.log('[fetchClients] Apps Script response status:', appsScriptResponse.status, appsScriptResponse.ok);
          
          if (appsScriptResponse.ok) {
            const text = await appsScriptResponse.text();
            console.log('[fetchClients] Apps Script response text length:', text.length);
            console.log('[fetchClients] Apps Script response preview:', text.substring(0, 200));
            
            // Check if response is JSON
            if (text.startsWith('[') || text.startsWith('{')) {
              try {
                const clients = JSON.parse(text);
                console.log('[fetchClients] Successfully parsed Apps Script response. Clients count:', Array.isArray(clients) ? clients.length : 'N/A');
                return clients;
              } catch (parseError) {
                console.error('[fetchClients] Failed to parse Apps Script JSON response:', parseError);
              }
            } else {
              console.warn('[fetchClients] Apps Script response is not JSON. Starting with:', text.substring(0, 50));
            }
          } else {
            console.warn('[fetchClients] Apps Script request failed with status:', appsScriptResponse.status);
          }
        } catch (appsScriptError) {
          console.error('[fetchClients] Error fetching from Apps Script:', appsScriptError);
        }
      } else {
        console.log('[fetchClients] Skipping Apps Script - URL not valid or contains placeholder');
      }

      console.warn('[fetchClients] No valid data source available. Both Google Sheets API and Apps Script are not configured or failed.');
      return [];
    } catch (error) {
      console.error('[fetchClients] Error fetching clients:', error);
      return [];
    }
  },

  /**
   * Save client to Google Sheets via Apps Script
   */
  async saveClient(client: Client): Promise<boolean> {
    console.log('[saveClient] Saving client:', client.id || 'new client');
    
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: client.id ? 'updateClient' : 'addClient',
          data: client
        })
      });
      console.log('[saveClient] Response status:', response.status);
      return true;
    } catch (error) {
      console.error('[saveClient] Error saving client:', error);
      return false;
    }
  },

  /**
   * Delete client from Google Sheets via Apps Script
   */
  async deleteClient(id: string): Promise<boolean> {
    console.log('[deleteClient] Deleting client:', id);
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteClient',
          id: id
        })
      });
      return true;
    } catch (error) {
      console.error('[deleteClient] Error deleting client:', error);
      return false;
    }
  }
};
