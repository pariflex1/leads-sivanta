/**
 * Google Apps Script for RealEstate CRM Pro
 * 
 * This script handles CRUD operations for the CRM data in Google Sheets.
 * Deploy this as a web app to enable save/update/delete functionality.
 * 
 * Deployment Steps:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Save (Ctrl+S)
 * 5. Deploy > New deployment
 * 6. Type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone (or restrict as needed)
 * 9. Copy the Web App URL to your .env.local file
 */

const SHEET_NAME = 'Leads';

/**
 * Handle GET requests - Fetch clients data
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return jsonResponse({ error: 'Sheet "Leads" not found' }, 404);
    }
    
    if (action === 'getClients') {
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        return jsonResponse([]);
      }
      
      const headers = data[0];
      const rows = data.slice(1);
      
      const clients = rows.map((row, index) => {
        const client = { 
          id: (index + 1).toString(),
          name: '',
          phone: '',
          email: '',
          profession: '',
          city: '',
          location: '',
          status: 'New Lead',
          notes: '',
          projectName: '',
          budgetRange: '',
          propertyType: '',
          followUpDate: '',
          followUpTime: '',
          followUpType: '',
          avatar: ''
        };
        
        headers.forEach((header, i) => {
          const key = header.toString().toLowerCase().replace(/\s+/g, '');
          const value = row[i] || '';
          
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
            case 'followuptime':
              client.followUpTime = value;
              break;
            case 'followuptype':
              client.followUpType = value;
              break;
            case 'clientimageurl':
            case 'image':
            case 'avatar':
              client.avatar = value;
              break;
          }
        });
        
        // Set default avatar if not provided
        if (!client.avatar) {
          client.avatar = `https://picsum.photos/seed/${client.name?.replace(/\s/g, '') || index}/200`;
        }
        
        // Set location from city if not provided
        if (!client.location && client.city) {
          client.location = client.city;
        }
        
        return client;
      });
      
      return jsonResponse(clients);
    }
    
    return jsonResponse({ error: 'Invalid action. Use ?action=getClients' }, 400);
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Handle POST requests - Add, Update, Delete clients
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return jsonResponse({ error: 'Sheet "Leads" not found' }, 404);
    }
    
    const action = data.action;
    
    if (action === 'addClient') {
      return addClient(sheet, data.data);
    }
    
    if (action === 'updateClient') {
      return updateClient(sheet, data.data);
    }
    
    if (action === 'deleteClient') {
      return deleteClient(sheet, data.id);
    }
    
    return jsonResponse({ error: 'Invalid action. Use addClient, updateClient, or deleteClient' }, 400);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Add a new client to the sheet
 */
function addClient(sheet, client) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // If no headers exist, create them
  if (headers.length === 0 || !headers[0]) {
    const defaultHeaders = [
      'Name', 'Phone', 'Email', 'Profession', 'City', 'Location', 
      'Status', 'Notes', 'Project Name', 'Budget Range', 'Property Type',
      'Follow Up Date', 'Follow Up Time', 'Follow Up Type', 'Client Image URL'
    ];
    sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
    headers.push(...defaultHeaders);
  }
  
  // Create row array matching header positions
  const row = headers.map(header => {
    const key = header.toString().toLowerCase().replace(/\s+/g, '');
    
    switch (key) {
      case 'name':
      case 'clientname':
        return client.name || '';
      case 'phone':
      case 'contact':
        return client.phone || '';
      case 'email':
        return client.email || '';
      case 'profession':
        return client.profession || '';
      case 'city':
        return client.city || '';
      case 'location':
        return client.location || client.city || '';
      case 'status':
        return client.status || 'New Lead';
      case 'notes':
        return client.notes || '';
      case 'projectname':
      case 'project':
        return client.projectName || '';
      case 'budget':
      case 'budgetrange':
        return client.budgetRange || '';
      case 'propertytype':
        return client.propertyType || '';
      case 'followupdate':
        return client.followUpDate || '';
      case 'followuptime':
        return client.followUpTime || '';
      case 'followuptype':
        return client.followUpType || '';
      case 'clientimageurl':
      case 'image':
      case 'avatar':
        return client.avatar || '';
      default:
        return '';
    }
  });
  
  sheet.appendRow(row);
  
  return jsonResponse({ 
    success: true, 
    message: 'Client added successfully',
    id: sheet.getLastRow() - 1
  });
}

/**
 * Update an existing client
 */
function updateClient(sheet, client) {
  if (!client.id) {
    return jsonResponse({ error: 'Client ID is required for update' }, 400);
  }
  
  const rowIndex = parseInt(client.id) + 1; // +1 because row 1 is headers
  
  if (rowIndex < 2 || rowIndex > sheet.getLastRow()) {
    return jsonResponse({ error: 'Client not found' }, 404);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => {
    const key = header.toString().toLowerCase().replace(/\s+/g, '');
    
    switch (key) {
      case 'name':
      case 'clientname':
        return client.name || '';
      case 'phone':
      case 'contact':
        return client.phone || '';
      case 'email':
        return client.email || '';
      case 'profession':
        return client.profession || '';
      case 'city':
        return client.city || '';
      case 'location':
        return client.location || client.city || '';
      case 'status':
        return client.status || 'New Lead';
      case 'notes':
        return client.notes || '';
      case 'projectname':
      case 'project':
        return client.projectName || '';
      case 'budget':
      case 'budgetrange':
        return client.budgetRange || '';
      case 'propertytype':
        return client.propertyType || '';
      case 'followupdate':
        return client.followUpDate || '';
      case 'followuptime':
        return client.followUpTime || '';
      case 'followuptype':
        return client.followUpType || '';
      case 'clientimageurl':
      case 'image':
      case 'avatar':
        return client.avatar || '';
      default:
        return '';
    }
  });
  
  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  
  return jsonResponse({ 
    success: true, 
    message: 'Client updated successfully' 
  });
}

/**
 * Delete a client from the sheet
 */
function deleteClient(sheet, id) {
  if (!id) {
    return jsonResponse({ error: 'Client ID is required' }, 400);
  }
  
  const rowIndex = parseInt(id) + 1; // +1 because row 1 is headers
  
  if (rowIndex < 2 || rowIndex > sheet.getLastRow()) {
    return jsonResponse({ error: 'Client not found' }, 404);
  }
  
  sheet.deleteRow(rowIndex);
  
  return jsonResponse({ 
    success: true, 
    message: 'Client deleted successfully' 
  });
}

/**
 * Helper function to create JSON response with CORS headers
 */
function jsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Note: CORS headers must be set in the Apps Script manifest (appsscript.json)
  // or handled at the client level with mode: 'no-cors'
  
  return output;
}
