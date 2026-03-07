export const hello = (name: string) => {
  return `Hello, ${name}!`;
};

export const getCellValue = (sheetName: string, cellAddress: string): string => {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetId');

  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID is not set in Script Properties');
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  const cell = sheet.getRange(cellAddress);
  const value = cell.getValue();

  return String(value);
};
