/**
 * ESG Telecom Survey - Google Apps Script Backend
 * 
 * Deployment Instructions (for fokundem653@gmail.com):
 * 1. Log in to Google as fokundem653@gmail.com.
 * 2. Open Google Sheets (create a new one or use your existing one).
 * 3. Extensions > Apps Script.
 * 4. Paste this code into Code.gs.
 * 5. Deploy > New Deployment > Web App.
 * 6. Set "Execute as" to "Me" and "Who has access" to "Anyone".
 * 7. Copy the Web App URL and set it as NEXT_PUBLIC_GOOGLE_SCRIPT_URL in your .env.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Submissions') || ss.insertSheet('Submissions');
    
    // 1. Create Folder and Save HTML Report
    const folderName = "ESG_Survey_Reports";
    const folders = DriveApp.getFoldersByName(folderName);
    let folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    const fileName = `Survey_${data.rawData.sectionA.company}_${new Date().getTime()}.html`;
    const file = folder.createFile(fileName, data.formattedHtml, MimeType.HTML);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const reportUrl = file.getUrl();

    // 2. Setup Headers if new sheet
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 
        'Company', 
        'Role', 
        'Department', 
        'Experience',
        'ESG Familiarity',
        'Survey Report (View)',
        'Data JSON'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // 3. Prepare Row Data
    const row = [
      new Date().toLocaleString(),
      data.rawData.sectionA.company,
      data.rawData.sectionA.role === 'Other (please specify)' ? data.rawData.sectionA.roleOther : data.rawData.sectionA.role,
      data.rawData.sectionA.department === 'Other (please specify)' ? data.rawData.sectionA.departmentOther : data.rawData.sectionA.department,
      data.rawData.sectionA.telecomExperience,
      data.rawData.sectionB.familiarityWithESG,
      reportUrl,
      JSON.stringify(data.rawData)
    ];

    sheet.appendRow(row);
    
    // 4. Formatting - Add Hyperlink to the URL cell
    const lastRow = sheet.getLastRow();
    const urlCell = sheet.getRange(lastRow, 7);
    const richValue = SpreadsheetApp.newRichTextValue()
      .setText("View Formatted Report")
      .setLinkUrl(reportUrl)
      .build();
    urlCell.setRichTextValue(richValue);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Submission recorded and report generated successfully',
      reportUrl: reportUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(error);
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
