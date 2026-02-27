/**
 * ESG Telecom Survey - Google Apps Script Backend (Google Sheets)
 * 
 * Appends each survey response as a row in a Google Sheet.
 * 
 * Deployment (for fokundem.com@gmail.com):
 * 1. Log in as fokundem.com@gmail.com.
 * 2. Go to https://script.google.com > New Project.
 * 3. Paste this code into Code.gs.
 * 4. Deploy > New Deployment > Web App.
 * 5. Execute as: "Me", Who has access: "Anyone".
 * 6. Copy Web App URL into .env as NEXT_PUBLIC_GOOGLE_SCRIPT_URL.
 */

// ── CHANGE THIS to your Google Sheet ID ──
// Open your Google Sheet, copy the ID from the URL:
// https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
const SHEET_ID = '1m1qCIj9lU1bd1V9epDTu0srZWyBu5Qspw72iAa1tHUI';

function getOrCreateSheet() {
  let ss;
  if (SHEET_ID) {
    ss = SpreadsheetApp.openById(SHEET_ID);
  } else {
    // Auto-create a sheet if no ID is provided
    const files = DriveApp.getFilesByName('ESG Survey Responses');
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create('ESG Survey Responses');
    }
  }
  
  let sheet = ss.getSheetByName('Responses');
  if (!sheet) {
    sheet = ss.insertSheet('Responses');
    const headers = [
      'Timestamp',
      'Company',
      'Role',
      'Department',
      'Experience',
      'ESG Familiarity',
      'Sustainability Practice Level',
      'ESG Reporting',
      'Env: Energy Efficiency',
      'Env: Data Centre',
      'Env: Waste Management',
      'Env: Regulatory Compliance',
      'Env: Tracking',
      'Soc: Employee Wellbeing',
      'Soc: Diversity',
      'Soc: Community',
      'Soc: Customer Satisfaction',
      'Soc: Data Privacy',
      'Soc: Training',
      'Gov: Board Oversight',
      'Gov: Ethical Conduct',
      'Gov: Risk Management',
      'Gov: Transparency',
      'Gov: Stakeholder Engagement',
      'ESG Importance',
      'Financial Benefits',
      'Profitability Agreement',
      'Measurable Link',
      'Strategic Challenges',
      'Barrier: Financial',
      'Barrier: Skills',
      'Barrier: Data',
      'Barrier: Resistance',
      'Barrier: Guidance',
      'Readiness',
      'Dedicated ESG Team',
      'Tracked Indicators',
      'Recommendations'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const r = data.rawData;
    const sheet = getOrCreateSheet();

    const role = r.sectionA.role === 'Other (please specify)' ? r.sectionA.roleOther : r.sectionA.role;
    const dept = r.sectionA.department === 'Other (please specify)' ? r.sectionA.departmentOther : r.sectionA.department;

    const row = [
      new Date().toLocaleString(),
      r.sectionA.company,
      role,
      dept,
      r.sectionA.telecomExperience,
      r.sectionB.familiarityWithESG,
      r.sectionB.sustainabilityPracticeLevel,
      r.sectionB.esgReporting,
      r.sectionC.environmental.energyEfficiency,
      r.sectionC.environmental.dataCentreEnergyManagement,
      r.sectionC.environmental.wasteManagement,
      r.sectionC.environmental.regulatoryCompliance,
      r.sectionC.environmental.environmentalTracking,
      r.sectionC.social.employeeWellbeing,
      r.sectionC.social.diversityInclusion,
      r.sectionC.social.communityInvestment,
      r.sectionC.social.customerSatisfaction,
      r.sectionC.social.dataPrivacyProtection,
      r.sectionC.social.trainingDevelopment,
      r.sectionC.governance.boardOversight,
      r.sectionC.governance.ethicalConduct,
      r.sectionC.governance.riskManagement,
      r.sectionC.governance.transparencyReporting,
      r.sectionC.governance.stakeholderEngagement,
      r.sectionD.esgImportance,
      (r.sectionD.financialBenefits || []).join(', '),
      r.sectionD.profitabilityAgreement,
      r.sectionD.measurableLink,
      (r.sectionE.strategicChallenges || []).join(', '),
      r.sectionE.barrierSignificance.financialConstraints,
      r.sectionE.barrierSignificance.lackOfSkills,
      r.sectionE.barrierSignificance.limitedData,
      r.sectionE.barrierSignificance.resistanceToChange,
      r.sectionE.barrierSignificance.lackOfGuidance,
      r.sectionF.readiness,
      r.sectionF.dedicatedESGTeam,
      (r.sectionF.trackedIndicators || []).join(', '),
      r.sectionG.recommendations || ''
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Response saved to Google sheet'
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

/**
 * TEST FUNCTION - Run this directly from the Apps Script editor!
 * Click the ▶️ Run button with this function selected.
 * It writes a test row to your sheet to verify the connection works.
 */
function testWrite() {
  try {
    const sheet = getOrCreateSheet();
    sheet.appendRow([
      new Date().toLocaleString(),
      'TEST COMPANY',
      'Test Role',
      'Test Dept',
      'Test Experience',
      'Test Familiarity',
      'Test Practice',
      'Test Reporting',
      'Test 1','Test 2','Test 3','Test 4','Test 5',
      'Test 6','Test 7','Test 8','Test 9','Test 10','Test 11',
      'Test 12','Test 13','Test 14','Test 15','Test 16',
      'Test Importance',
      'Test Benefits',
      'Test Profitability',
      'Test Link',
      'Test Challenges',
      'Test B1','Test B2','Test B3','Test B4','Test B5',
      'Test Readiness',
      'Test Team',
      'Test Indicators',
      'TEST - This is a test submission'
    ]);
    Logger.log('✅ SUCCESS! Test row written to sheet: ' + sheet.getParent().getUrl());
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
  }
}
