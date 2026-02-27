/**
 * ESG Telecom Survey - Google Apps Script Backend
 * 
 * Saves each survey response as a beautifully formatted HTML file
 * in Google Drive, preserving the exact survey UI with highlighted answers.
 * 
 * Deployment Instructions (for fokundem.com@gmail.com):
 * 1. Log in to Google as fokundem.com@gmail.com.
 * 2. Go to https://script.google.com and create a New Project.
 * 3. Paste this code into Code.gs.
 * 4. Deploy > New Deployment > Web App.
 * 5. Set "Execute as" to "Me" and "Who has access" to "Anyone".
 * 6. Copy the Web App URL and set it as NEXT_PUBLIC_GOOGLE_SCRIPT_URL in your .env.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const raw = data.rawData;
    
    // 1. Create/Find Folder
    const folderName = "ESG_Survey_Responses";
    const folders = DriveApp.getFoldersByName(folderName);
    let folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    // 2. Save the formatted HTML as a viewable file
    const company = raw.sectionA.company || "Unknown";
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd_HH-mm");
    const fileName = `ESG_Survey_${company}_${timestamp}.html`;
    
    const file = folder.createFile(fileName, data.formattedHtml, MimeType.HTML);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const viewUrl = `https://drive.google.com/file/d/${file.getId()}/view`;

    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Survey report saved successfully',
      reportUrl: viewUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
